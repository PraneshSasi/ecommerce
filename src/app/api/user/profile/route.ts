import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { supabaseServer } from "@/lib/supabaseServer";
import { Prisma } from "@prisma/client";

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: {
        id: true,
        supabaseId: true,
        name: true,
        email: true,
        avatarUrl: true,
        address: {
          select: {
            phone: true,
            addressLine: true,
            city: true,
            state: true,
            pincode: true,
          }
        },
        createdAt: true,
      },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Flatten address fields into root user object for frontend compatibility
    const { address, ...restUser } = user;
    const flattenedUser = {
      ...restUser,
      phone: address?.phone || null,
      addressLine: address?.addressLine || null,
      city: address?.city || null,
      state: address?.state || null,
      pincode: address?.pincode || null,
    };

    return NextResponse.json(flattenedUser);
  } catch (error) {
    console.error("Profile fetch error:", error);
    return NextResponse.json({ error: "Failed to fetch profile" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const formData = await req.formData();
    const name = formData.get("name") as string;
    const phone = formData.get("phone") as string;
    const addressLine = formData.get("addressLine") as string;
    const city = formData.get("city") as string;
    const state = formData.get("state") as string;
    const pincode = formData.get("pincode") as string;
    const avatarFile = formData.get("avatar") as File | null;

    let avatarUrl: string | undefined = undefined;

    if (avatarFile && avatarFile.size > 0) {
      const fileExt = avatarFile.name.split(".").pop();
      const fileName = `${session.user.id}-${Date.now()}.${fileExt}`;
      const filePath = `avatars/${fileName}`;

      const arrayBuffer = await avatarFile.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      const { error } = await supabaseServer.storage
        .from("avatars")
        .upload(filePath, buffer, {
          contentType: avatarFile.type,
          upsert: true,
        });

      if (error) {
        console.error("Supabase storage upload error:", error);
        return NextResponse.json({ error: `Failed to upload avatar: ${error.message}` }, { status: 500 });
      }

      const { data: publicUrlData } = supabaseServer.storage
        .from("avatars")
        .getPublicUrl(filePath);

      avatarUrl = publicUrlData.publicUrl;
    }

    const updateData: Prisma.UserUpdateInput = {};
    if (name !== null && name !== undefined) updateData.name = name;
    if (avatarUrl) updateData.avatarUrl = avatarUrl;

    const addressUpdateData: Prisma.AddressUpdateWithoutUserInput = {};
    if (phone !== null && phone !== undefined) addressUpdateData.phone = phone;
    if (addressLine !== null && addressLine !== undefined) addressUpdateData.addressLine = addressLine;
    if (city !== null && city !== undefined) addressUpdateData.city = city;
    if (state !== null && state !== undefined) addressUpdateData.state = state;
    if (pincode !== null && pincode !== undefined) addressUpdateData.pincode = pincode;

    // Connect or Create the address if there is address data to update
    if (Object.keys(addressUpdateData).length > 0) {
      updateData.address = {
        upsert: {
          create: addressUpdateData as Prisma.AddressCreateWithoutUserInput,
          update: addressUpdateData,
        }
      };
    }

    const updatedUser = await prisma.user.update({
      where: { id: session.user.id },
      data: updateData,
      select: {
        id: true,
        name: true,
        email: true,
        avatarUrl: true,
        address: {
          select: {
            phone: true,
            addressLine: true,
            city: true,
            state: true,
            pincode: true,
          }
        }
      },
    });

    // Flatten address fields into root user object for frontend compatibility
    const { address, ...restUser } = updatedUser;
    const flattenedUser = {
      ...restUser,
      phone: address?.phone || null,
      addressLine: address?.addressLine || null,
      city: address?.city || null,
      state: address?.state || null,
      pincode: address?.pincode || null,
    };

    return NextResponse.json({ success: true, user: flattenedUser });
  } catch (error) {
    console.error("Profile update error:", error);
    return NextResponse.json({ error: "Failed to update profile" }, { status: 500 });
  }
}
