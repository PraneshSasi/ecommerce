import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

const products = [
  {
    title: "Apple iPhone 15 Pro Max",
    description:
      "Experience the pinnacle of smartphone technology with the iPhone 15 Pro Max. Featuring a titanium design, A17 Pro chip, and a revolutionary camera system with 5x optical zoom. The Super Retina XDR display with ProMotion technology delivers stunning visuals.",
    price: 134900,
    originalPrice: 159900,
    discount: 16,
    rating: 4.8,
    reviewCount: 12453,
    category: "Electronics",
    brand: "Apple",
    stock: 45,
    images: JSON.stringify([
      "https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=800&q=80",
      "https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?w=800&q=80",
      "https://images.unsplash.com/photo-1591337676887-a217a6970a8a?w=800&q=80",
      "https://images.unsplash.com/photo-1574944985070-8f3ebc6b79d2?w=800&q=80",
    ]),
  },
  {
    title: "Sony WH-1000XM5 Headphones",
    description:
      "Industry-leading noise canceling headphones with Auto NC Optimizer. Enjoy up to 30 hours of battery life and exceptionally lightweight construction. Multi-device pairing and speak-to-chat technology make these the ultimate travel companion.",
    price: 24990,
    originalPrice: 34990,
    discount: 29,
    rating: 4.7,
    reviewCount: 8921,
    category: "Electronics",
    brand: "Sony",
    stock: 120,
    images: JSON.stringify([
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80",
      "https://images.unsplash.com/photo-1484704849700-f032a568e944?w=800&q=80",
      "https://images.unsplash.com/photo-1524678606370-a47ad25cb82a?w=800&q=80",
      "https://images.unsplash.com/photo-1487215078519-e21cc028cb29?w=800&q=80",
    ]),
  },
  {
    title: "Nike Air Jordan 1 Retro High OG",
    description:
      "The shoe that started it all returns in premium form. The Air Jordan 1 Retro High OG features a full-grain leather upper for durability and style. Original sole tooling with visible Air cushioning for comfort and heritage style.",
    price: 12995,
    originalPrice: 17995,
    discount: 28,
    rating: 4.9,
    reviewCount: 23567,
    category: "Fashion",
    brand: "Nike",
    stock: 30,
    images: JSON.stringify([
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&q=80",
      "https://images.unsplash.com/photo-1600185365926-3a2ce3cdb9eb?w=800&q=80",
      "https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=800&q=80",
      "https://images.unsplash.com/photo-1579338559194-a162d19bf842?w=800&q=80",
    ]),
  },
  {
    title: "Samsung 4K QLED Smart TV 55\"",
    description:
      "Quantum Dot technology delivers 100% Color Volume for breathtaking picture quality. The Neural Quantum Processor 4K uses AI to optimize every scene. With a slim, elegant design and minimalistic cable management, it's a visual masterpiece.",
    price: 79990,
    originalPrice: 109990,
    discount: 27,
    rating: 4.6,
    reviewCount: 5673,
    category: "Electronics",
    brand: "Samsung",
    stock: 25,
    images: JSON.stringify([
      "https://images.unsplash.com/photo-1593784991095-a205069470b6?w=800&q=80",
      "https://images.unsplash.com/photo-1461151304267-38535e780c79?w=800&q=80",
      "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=800&q=80",
      "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80",
    ]),
  },
  {
    title: "Levi's 511 Slim Fit Jeans",
    description:
      "The 511 Slim Fit Jeans sit below the waist with a slim fit through the thigh and a narrow leg opening. Made with stretch denim for all-day comfort. A timeless wardrobe essential that pairs with everything from tees to blazers.",
    price: 2999,
    originalPrice: 4999,
    discount: 40,
    rating: 4.4,
    reviewCount: 34891,
    category: "Fashion",
    brand: "Levi's",
    stock: 200,
    images: JSON.stringify([
      "https://images.unsplash.com/photo-1542272604-787c3835535d?w=800&q=80",
      "https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=800&q=80",
      "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=800&q=80",
      "https://images.unsplash.com/photo-1542272604-787c3835535d?w=800&q=80",
    ]),
  },
  {
    title: "Apple MacBook Pro 14\" M3",
    description:
      "The most powerful MacBook Pro ever is here. With the M3 chip family, it's transformative for pros who push the limits. Exceptional performance, battery life, and connectivity in a stunning design with the best camera, mics, and speakers.",
    price: 168900,
    originalPrice: 198900,
    discount: 15,
    rating: 4.9,
    reviewCount: 7823,
    category: "Electronics",
    brand: "Apple",
    stock: 15,
    images: JSON.stringify([
      "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&q=80",
      "https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?w=800&q=80",
      "https://images.unsplash.com/photo-1540829917886-91ab031b1764?w=800&q=80",
      "https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=800&q=80",
    ]),
  },
  {
    title: "Adidas Ultraboost 23 Running Shoes",
    description:
      "Engineered for runners who demand the best, the Ultraboost 23 features responsive Boost cushioning and a Primeknit upper for a sock-like fit. Continental rubber outsole provides incredible grip. Energy returns with every stride.",
    price: 14999,
    originalPrice: 19999,
    discount: 25,
    rating: 4.6,
    reviewCount: 15234,
    category: "Sports",
    brand: "Adidas",
    stock: 80,
    images: JSON.stringify([
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&q=80",
      "https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=800&q=80",
      "https://images.unsplash.com/photo-1560769629-975ec94e6a86?w=800&q=80",
      "https://images.unsplash.com/photo-1515955656352-a1fa3ffcd111?w=800&q=80",
    ]),
  },
  {
    title: "IKEA MALM Bed Frame with Storage",
    description:
      "Clean lines and practicality make this bed frame a versatile choice. Four large drawers for extra storage, perfect for smaller spaces. The high headboard gives a sense of luxury and provides extra comfort when reading in bed.",
    price: 32999,
    originalPrice: 42999,
    discount: 23,
    rating: 4.3,
    reviewCount: 9821,
    category: "Home",
    brand: "IKEA",
    stock: 10,
    images: JSON.stringify([
      "https://images.unsplash.com/photo-1505693314120-0d443867891c?w=800&q=80",
      "https://images.unsplash.com/photo-1540518614846-7eded433c457?w=800&q=80",
      "https://images.unsplash.com/photo-1556020685-ae41abfc9365?w=800&q=80",
      "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=800&q=80",
    ]),
  },
  {
    title: "Canon EOS R50 Mirrorless Camera",
    description:
      "The EOS R50 is perfect for creators stepping into the world of photography and video. Features a 24.2MP APS-C sensor, 4K video recording, and Canon's Dual Pixel CMOS AF II for fast, accurate autofocus. Compact and lightweight body.",
    price: 58990,
    originalPrice: 74990,
    discount: 21,
    rating: 4.7,
    reviewCount: 3421,
    category: "Electronics",
    brand: "Canon",
    stock: 35,
    images: JSON.stringify([
      "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=800&q=80",
      "https://images.unsplash.com/photo-1510127034890-ba27508e9f1c?w=800&q=80",
      "https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=800&q=80",
      "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=800&q=80",
    ]),
  },
  {
    title: "Puma Men's Graphic Oversized T-Shirt",
    description:
      "Make a bold statement with this oversized graphic tee from Puma. Crafted from 100% soft cotton, it features a relaxed silhouette and vibrant screen-print graphics. Versatile enough for the gym, streetwear, or casual outings.",
    price: 1299,
    originalPrice: 2499,
    discount: 48,
    rating: 4.2,
    reviewCount: 67823,
    category: "Fashion",
    brand: "Puma",
    stock: 500,
    images: JSON.stringify([
      "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800&q=80",
      "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=800&q=80",
      "https://images.unsplash.com/photo-1562157873-818bc0726f68?w=800&q=80",
      "https://images.unsplash.com/photo-1529374255404-311a2a4f1fd9?w=800&q=80",
    ]),
  },
  {
    title: "Dyson V15 Detect Cordless Vacuum",
    description:
      "The Dyson V15 Detect automatically adapts suction to reveal microscopic dust you can't see. The laser reveals hidden dust on hard floors. HEPA filtration traps 99.97% of particles. Up to 60 minutes of fade-free power.",
    price: 49900,
    originalPrice: 62900,
    discount: 21,
    rating: 4.8,
    reviewCount: 4231,
    category: "Home",
    brand: "Dyson",
    stock: 42,
    images: JSON.stringify([
      "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80",
      "https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?w=800&q=80",
      "https://images.unsplash.com/photo-1513694203232-719a280e022f?w=800&q=80",
      "https://images.unsplash.com/photo-1600121848594-d8644e57abab?w=800&q=80",
    ]),
  },
  {
    title: "Fitbit Charge 6 Fitness Tracker",
    description:
      "Track your health with the most comprehensive fitness tracker from Fitbit. Features built-in GPS, heart rate monitoring, sleep tracking, and stress management tools. Compatible with Google Maps, Google Wallet, and YouTube Music.",
    price: 14999,
    originalPrice: 19999,
    discount: 25,
    rating: 4.5,
    reviewCount: 18932,
    category: "Sports",
    brand: "Fitbit",
    stock: 90,
    images: JSON.stringify([
      "https://images.unsplash.com/photo-1575311373937-040b8e1fd5b6?w=800&q=80",
      "https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=800&q=80",
      "https://images.unsplash.com/photo-1434494878577-86c23bcb06b9?w=800&q=80",
      "https://images.unsplash.com/photo-1510771463146-e89e6e86560e?w=800&q=80",
    ]),
  },
  {
    title: "The North Face Thermoball Jacket",
    description:
      "Packable PrimaLoft insulation provides warmth even when wet. The ThermoBall Eco jacket uses recycled insulation that mimics natural down. Water-resistant finish repels light rain and snow. Compresses into its own chest pocket.",
    price: 11995,
    originalPrice: 16995,
    discount: 29,
    rating: 4.6,
    reviewCount: 8745,
    category: "Fashion",
    brand: "The North Face",
    stock: 65,
    images: JSON.stringify([
      "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=800&q=80",
      "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=800&q=80",
      "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&q=80",
      "https://images.unsplash.com/photo-1544923246-77307dd654cb?w=800&q=80",
    ]),
  },
  {
    title: "Instant Pot Duo 7-in-1 Pressure Cooker",
    description:
      "The Instant Pot Duo is a 7-in-1 multi-use programmable cooker: pressure cooker, slow cooker, rice cooker, steamer, sauté pan, yogurt maker, and food warmer. Reduces cooking time by up to 70% while saving energy.",
    price: 7499,
    originalPrice: 12999,
    discount: 42,
    rating: 4.7,
    reviewCount: 45671,
    category: "Home",
    brand: "Instant Pot",
    stock: 150,
    images: JSON.stringify([
      "https://images.unsplash.com/photo-1585515320310-259814833e62?w=800&q=80",
      "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&q=80",
      "https://images.unsplash.com/photo-1556909172-8c2f041fca1e?w=800&q=80",
      "https://images.unsplash.com/photo-1574269909862-7e1d70bb8078?w=800&q=80",
    ]),
  },
  {
    title: "Wilson Pro Staff RF97 Tennis Racket",
    description:
      "The racket of champions, inspired by Roger Federer's game. Features a Braided Graphite construction with Basalt fibers for precise control and stability. The classic design is updated with modern technology for ultimate performance.",
    price: 18999,
    originalPrice: 24999,
    discount: 24,
    rating: 4.8,
    reviewCount: 2341,
    category: "Sports",
    brand: "Wilson",
    stock: 28,
    images: JSON.stringify([
      "https://images.unsplash.com/photo-1554068865-24cecd4e34b8?w=800&q=80",
      "https://images.unsplash.com/photo-1599586120429-48281b6f0ece?w=800&q=80",
      "https://images.unsplash.com/photo-1554068865-24cecd4e34b8?w=800&q=80",
      "https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?w=800&q=80",
    ]),
  },
  {
    title: "boAt Rockerz 450 Bluetooth Headphone",
    description:
      "Immerse yourself in high-quality sound with 40mm dynamic drivers delivering powerful bass. Up to 15 hours of playback on a single charge with physical noise isolation. Foldable design makes it perfect for travel.",
    price: 1299,
    originalPrice: 3990,
    discount: 67,
    rating: 4.1,
    reviewCount: 234567,
    category: "Electronics",
    brand: "boAt",
    stock: 350,
    images: JSON.stringify([
      "https://images.unsplash.com/photo-1583394838336-acd977736f90?w=800&q=80",
      "https://images.unsplash.com/photo-1484704849700-f032a568e944?w=800&q=80",
      "https://images.unsplash.com/photo-1487215078519-e21cc028cb29?w=800&q=80",
      "https://images.unsplash.com/photo-1524678606370-a47ad25cb82a?w=800&q=80",
    ]),
  },
  {
    title: "ATOMBERG Renesa Smart + Ceiling Fan",
    description:
      "India's most energy-efficient ceiling fan uses BLDC technology to save up to 65% electricity. Compatible with Alexa and Google Home for smart home control. Comes with a remote control and sleep timer function.",
    price: 4399,
    originalPrice: 5999,
    discount: 27,
    rating: 4.4,
    reviewCount: 12893,
    category: "Home",
    brand: "Atomberg",
    stock: 75,
    images: JSON.stringify([
      "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80",
      "https://images.unsplash.com/photo-1513694203232-719a280e022f?w=800&q=80",
      "https://images.unsplash.com/photo-1556020685-ae41abfc9365?w=800&q=80",
      "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&q=80",
    ]),
  },
  {
    title: "Yoga Mat Premium Non-Slip 6mm",
    description:
      "Professional-grade yoga mat with superior grip and cushioning. Made from eco-friendly TPE material that is non-toxic and odor-resistant. Alignment lines help improve your posture and technique. Includes carrying strap.",
    price: 1499,
    originalPrice: 2999,
    discount: 50,
    rating: 4.5,
    reviewCount: 28934,
    category: "Sports",
    brand: "Lifelong",
    stock: 400,
    images: JSON.stringify([
      "https://images.unsplash.com/photo-1592419044706-39796d40f98c?w=800&q=80",
      "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800&q=80",
      "https://images.unsplash.com/photo-1518611012118-696072aa579a?w=800&q=80",
      "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&q=80",
    ]),
  },
  {
    title: "Ray-Ban Aviator Classic Sunglasses",
    description:
      "Timeless aviator sunglasses with crystal lenses offering superior optical clarity. The metal frame comes with adjustable nose pads for a comfortable fit. 100% UV protection. The iconic design worn by icons for over 80 years.",
    price: 9990,
    originalPrice: 13990,
    discount: 29,
    rating: 4.7,
    reviewCount: 19823,
    category: "Fashion",
    brand: "Ray-Ban",
    stock: 55,
    images: JSON.stringify([
      "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=800&q=80",
      "https://images.unsplash.com/photo-1508296695146-257a814070b4?w=800&q=80",
      "https://images.unsplash.com/photo-1574258495973-f010dfbb5371?w=800&q=80",
      "https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=800&q=80",
    ]),
  },
  {
    title: "Samsung Galaxy S24 Ultra",
    description:
      "The Galaxy S24 Ultra redefines what a smartphone can do. Built-in S Pen, 200MP pro-grade camera system, and Snapdragon 8 Gen 3 processor. The titanium frame is both strong and elegant. AI-powered features throughout.",
    price: 109999,
    originalPrice: 134999,
    discount: 19,
    rating: 4.7,
    reviewCount: 9234,
    category: "Electronics",
    brand: "Samsung",
    stock: 38,
    images: JSON.stringify([
      "https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=800&q=80",
      "https://images.unsplash.com/photo-1574944985070-8f3ebc6b79d2?w=800&q=80",
      "https://images.unsplash.com/photo-1591337676887-a217a6970a8a?w=800&q=80",
      "https://images.unsplash.com/photo-1512054502232-10a0a035d672?w=800&q=80",
    ]),
  },
  {
    title: "Nintendo Switch OLED Model",
    description: "Play at home or on the go with a vibrant 7-inch OLED screen. Features a wide adjustable stand, a dock with a wired LAN port, 64 GB of internal storage, and enhanced audio.",
    price: 34999,
    originalPrice: 39999,
    discount: 12,
    rating: 4.8,
    reviewCount: 45123,
    category: "Electronics",
    brand: "Nintendo",
    stock: 85,
    images: JSON.stringify([
      "https://images.unsplash.com/photo-1593305841991-05c297ba4575?w=800&q=80",
      "https://images.unsplash.com/photo-1593118247619-e2d6f056869e?w=800&q=80",
      "https://images.unsplash.com/photo-1593305841991-05c297ba4575?w=800&q=80",
      "https://images.unsplash.com/photo-1593118247619-e2d6f056869e?w=800&q=80",
    ]),
  },
  {
    title: "Under Armour Men's Tech 2.0 Short-Sleeve T-Shirt",
    description: "UA Tech fabric is quick-drying, ultra-soft & has a more natural feel. Material wicks sweat & dries really fast. Anti-odor technology prevents the growth of odor-causing microbes.",
    price: 1499,
    originalPrice: 2299,
    discount: 35,
    rating: 4.5,
    reviewCount: 10452,
    category: "Fashion",
    brand: "Under Armour",
    stock: 120,
    images: JSON.stringify([
      "https://images.unsplash.com/photo-1581655353564-df123a1eb820?w=800&q=80",
      "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800&q=80",
      "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=800&q=80",
      "https://images.unsplash.com/photo-1503342394128-c104d54dba01?w=800&q=80",
    ]),
  },
  {
    title: "Nespresso Vertuo Plus Coffee and Espresso Machine",
    description: "Versatile automatic coffee maker. Brews 4 different cup sizes at the touch of a button. Uses Centrifusion technology for the perfect crema every time.",
    price: 15999,
    originalPrice: 21999,
    discount: 27,
    rating: 4.7,
    reviewCount: 8901,
    category: "Home",
    brand: "Nespresso",
    stock: 22,
    images: JSON.stringify([
      "https://images.unsplash.com/photo-1585515320310-259814833e62?w=800&q=80",
      "https://images.unsplash.com/photo-1511920170033-f8396924c348?w=800&q=80",
      "https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?w=800&q=80",
      "https://images.unsplash.com/photo-1558562805-4bf1e2a724eb?w=800&q=80",
    ]),
  },
  {
    title: "YETI Rambler 20 oz Tumbler",
    description: "Any tumbler that's coming along for the ride needs to be tough enough to keep up. Made from durable stainless steel with double-wall vacuum insulation to protect your hot or cold beverage at all costs.",
    price: 2999,
    originalPrice: 3599,
    discount: 16,
    rating: 4.9,
    reviewCount: 34512,
    category: "Home",
    brand: "YETI",
    stock: 200,
    images: JSON.stringify([
      "https://images.unsplash.com/photo-1590846406792-0adc7f938f1d?w=800&q=80",
      "https://images.unsplash.com/photo-1590846406792-0adc7f938f1d?w=800&q=80",
      "https://images.unsplash.com/photo-1590846406792-0adc7f938f1d?w=800&q=80",
      "https://images.unsplash.com/photo-1601004890684-d8cbf643f5f2?w=800&q=80",
    ]),
  },
  {
    title: "Garmin Forerunner 245 Music",
    description: "GPS running smartwatch with advanced training features and music storage. Evaluates your training status to indicate if you're under-training or overdoing it. Battery life up to 7 days in smartwatch mode.",
    price: 24990,
    originalPrice: 29990,
    discount: 16,
    rating: 4.6,
    reviewCount: 7890,
    category: "Sports",
    brand: "Garmin",
    stock: 55,
    images: JSON.stringify([
      "https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=800&q=80",
      "https://images.unsplash.com/photo-1575311373937-040b8e1fd5b6?w=800&q=80",
      "https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=800&q=80",
      "https://images.unsplash.com/photo-1434494878577-86c23bcb06b9?w=800&q=80",
    ]),
  },
  {
    title: "Hydro Flask Standard Mouth Water Bottle",
    description: "TempShield insulation eliminates condensation and keeps beverages cold up to 24 hours and hot up to 12 hours. Made with 18/8 pro-grade stainless steel to ensure pure taste and no flavor transfer.",
    price: 3499,
    originalPrice: 4299,
    discount: 18,
    rating: 4.8,
    reviewCount: 21345,
    category: "Sports",
    brand: "Hydro Flask",
    stock: 140,
    images: JSON.stringify([
      "https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=800&q=80",
      "https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=800&q=80",
      "https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=800&q=80",
      "https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=800&q=80",
    ]),
  },
  {
    title: "JBL Flip 6 Portable Bluetooth Speaker",
    description: "Bold sound for every adventure. The JBL Flip 6 features a 2-way speaker system engineered to deliver loud, crystal clear, powerful sound. Waterproof and dustproof design so you can take it anywhere.",
    price: 9999,
    originalPrice: 13999,
    discount: 28,
    rating: 4.7,
    reviewCount: 15670,
    category: "Electronics",
    brand: "JBL",
    stock: 90,
    images: JSON.stringify([
      "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=800&q=80",
      "https://images.unsplash.com/photo-1589256469067-ea99122bbdc4?w=800&q=80",
      "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=800&q=80",
      "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=800&q=80",
    ]),
  },
  {
    title: "Vitamix 5200 Blender Professional-Grade",
    description: "The variable speed control easily adjusts to achieve a variety of textures. The dial can be rotated at any point during the blend. The size and shape of the classic 64-ounce container is ideal for blending medium to large batches.",
    price: 39999,
    originalPrice: 48999,
    discount: 18,
    rating: 4.8,
    reviewCount: 6721,
    category: "Home",
    brand: "Vitamix",
    stock: 15,
    images: JSON.stringify([
      "https://images.unsplash.com/photo-1585515320310-259814833e62?w=800&q=80",
      "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&q=80",
      "https://images.unsplash.com/photo-1556909172-8c2f041fca1e?w=800&q=80",
      "https://images.unsplash.com/photo-1574269909862-7e1d70bb8078?w=800&q=80",
    ]),
  },
  {
    title: "Oculus Quest 2 Advanced All-In-One VR Headset",
    description: "Experience total immersion with 3D positional audio, hand tracking and haptic feedback. Explore an expanding universe of over 250 titles across gaming, fitness, social/multiplayer and entertainment.",
    price: 31990,
    originalPrice: 39990,
    discount: 20,
    rating: 4.7,
    reviewCount: 28901,
    category: "Electronics",
    brand: "Meta",
    stock: 45,
    images: JSON.stringify([
      "https://images.unsplash.com/photo-1622979135225-d2ba269cf1ac?w=800&q=80",
      "https://images.unsplash.com/photo-1592478411213-6153e4ebc07d?w=800&q=80",
      "https://images.unsplash.com/photo-1622979135225-d2ba269cf1ac?w=800&q=80",
      "https://images.unsplash.com/photo-1622979135225-d2ba269cf1ac?w=800&q=80",
    ]),
  },
  {
    title: "Bose QuietComfort 45 Bluetooth Wireless Headphones",
    description: "Iconic quiet, comfort, and sound. The first noise cancelling headphones are back, with quiet that's deeper and sound that's clearer. Plus, new materials for a premium fit and feel.",
    price: 29990,
    originalPrice: 34990,
    discount: 14,
    rating: 4.8,
    reviewCount: 12345,
    category: "Electronics",
    brand: "Bose",
    stock: 65,
    images: JSON.stringify([
      "https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=800&q=80",
      "https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?w=800&q=80",
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80",
      "https://images.unsplash.com/photo-1484704849700-f032a568e944?w=800&q=80",
    ]),
  },
  {
    title: "TP-Link Smart WiFi Outlet Adapter",
    description: "Control your appliances from anywhere with this Wi-Fi enabled smart outlet adapter. Features scheduling, timer functions, voice control via Alexa and Google Home, and energy monitoring via the app.",
    price: 1299,
    originalPrice: 2499,
    discount: 48,
    rating: 4.4,
    reviewCount: 3942,
    category: "Electronics",
    brand: "TP-Link",
    stock: 150,
    images: JSON.stringify([
      "https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=800&q=80",
      "https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=800&q=80",
    ]),
  },
  {
    title: "Sony PlayStation 5 Pro Console",
    description: "Experience the next level of gaming with the PS5 Pro. Featuring advanced ray tracing, super-sharp image clarity with PSSR AI-upscaling, high frame rate gameplay up to 120fps, and a 2TB custom SSD for ultra-fast load times.",
    price: 69999,
    originalPrice: 79999,
    discount: 12,
    rating: 4.8,
    reviewCount: 1542,
    category: "Electronics",
    brand: "Sony",
    stock: 15,
    images: JSON.stringify([
      "https://images.unsplash.com/photo-1606813907291-d86efa9b94db?w=800&q=80",
      "https://images.unsplash.com/photo-1606813907291-d86efa9b94db?w=800&q=80",
    ]),
  },
  {
    title: "Puma Unisex Crew Socks (Pack of 3)",
    description: "Step into everyday comfort with Puma Crew Socks. Made with premium combed cotton and elastane for perfect stretch, ribbed cuffs to prevent slipping, and cushioned soles for impact absorption.",
    price: 499,
    originalPrice: 999,
    discount: 50,
    rating: 4.3,
    reviewCount: 8941,
    category: "Fashion",
    brand: "Puma",
    stock: 350,
    images: JSON.stringify([
      "https://images.unsplash.com/photo-1582966772680-860e372bb558?w=800&q=80",
      "https://images.unsplash.com/photo-1582966772680-860e372bb558?w=800&q=80",
    ]),
  },
  {
    title: "Zara Men's Premium Leather Biker Jacket",
    description: "Elevate your look with Zara's classic leather biker jacket. Crafted from 100% genuine nappa sheepskin leather, featuring asymmetric zip closure, metal snaps, zipped cuffs, and a quilted lining for warmth and luxury.",
    price: 11990,
    originalPrice: 15990,
    discount: 25,
    rating: 4.6,
    reviewCount: 732,
    category: "Fashion",
    brand: "Zara",
    stock: 25,
    images: JSON.stringify([
      "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=800&q=80",
      "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=800&q=80",
    ]),
  },
  {
    title: "Borosil Glass Coffee Mug (Pack of 2)",
    description: "Enjoy your morning brew in style with Borosil's double-walled borosilicate glass mugs. Keeps your coffee hot while remaining cool to the touch. Lightweight yet highly durable, microwave and dishwasher safe.",
    price: 649,
    originalPrice: 999,
    discount: 35,
    rating: 4.5,
    reviewCount: 4210,
    category: "Home",
    brand: "Borosil",
    stock: 180,
    images: JSON.stringify([
      "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=800&q=80",
      "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=800&q=80",
    ]),
  },
  {
    title: "Dyson Purifier Cool Air Purifier",
    description: "Breathe cleaner air with Dyson's advanced air purifier. Automatically senses, captures, and projects purified air throughout the room. Fully sealed HEPA filter removes 99.95% of allergens, pollutants, and viruses.",
    price: 39900,
    originalPrice: 45900,
    discount: 13,
    rating: 4.7,
    reviewCount: 1832,
    category: "Home",
    brand: "Dyson",
    stock: 28,
    images: JSON.stringify([
      "https://images.unsplash.com/photo-1513694203232-719a280e022f?w=800&q=80",
      "https://images.unsplash.com/photo-1513694203232-719a280e022f?w=800&q=80",
    ]),
  },
  {
    title: "Nivia Classic Football Hand Pump",
    description: "Keep your sports balls inflated with Nivia's double-action hand pump. Inflates on both push and pull actions for speed, includes a flexible hose, inflating needle, and a lightweight, durable plastic body.",
    price: 299,
    originalPrice: 499,
    discount: 40,
    rating: 4.2,
    reviewCount: 12450,
    category: "Sports",
    brand: "Nivia",
    stock: 500,
    images: JSON.stringify([
      "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=800&q=80",
      "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=800&q=80",
    ]),
  },
  {
    title: "Trek Marlin 7 Hybrid Mountain Bike",
    description: "Trek's flagship trail-ready mountain bike that's perfect for daily commutes and rugged trails. Featuring a lightweight alpha aluminum frame, RockShox suspension fork, Shimano 1x10 drivetrain, and hydraulic disc brakes.",
    price: 64999,
    originalPrice: 79999,
    discount: 18,
    rating: 4.9,
    reviewCount: 1892,
    category: "Sports",
    brand: "Trek",
    stock: 8,
    images: JSON.stringify([
      "https://images.unsplash.com/photo-1485965120184-e220f721d03e?w=800&q=80",
      "https://images.unsplash.com/photo-1485965120184-e220f721d03e?w=800&q=80",
    ]),
  },
  {
    title: "SanDisk Ultra 128GB MicroSDXC Card",
    description:
      "Expand your storage on smartphones, tablets, and cameras. With read speeds up to 140MB/s, you can move files fast. Class 10 for Full HD video recording and playback.",
    price: 899,
    originalPrice: 1899,
    discount: 52,
    rating: 4.4,
    reviewCount: 3841,
    category: "Electronics",
    brand: "SanDisk",
    stock: 250,
    images: JSON.stringify([
      "https://images.unsplash.com/photo-1544816155-12df9643f363?w=800&q=80",
      "https://images.unsplash.com/photo-1591405351990-4726e331f141?w=800&q=80",
    ]),
  },
  {
    title: "Logitech MX Master 3S Wireless Mouse",
    description:
      "An iconic mouse remastered. Features Quiet Clicks, 8K DPI tracking on any surface (even glass), and the MagSpeed electromagnetic scroll wheel for ultimate precision and speed.",
    price: 9495,
    originalPrice: 10995,
    discount: 13,
    rating: 4.7,
    reviewCount: 2314,
    category: "Electronics",
    brand: "Logitech",
    stock: 85,
    images: JSON.stringify([
      "https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=800&q=80",
      "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=800&q=80",
    ]),
  },
  {
    title: "Apple iPad Pro 13\" (M4 Chip)",
    description:
      "The thinnest Apple product ever, featuring the outrageously powerful M4 chip, a breakthrough Ultra Retina XDR display with tandem OLED technology, and superfast Wi-Fi 6E.",
    price: 129900,
    originalPrice: 139900,
    discount: 7,
    rating: 4.9,
    reviewCount: 842,
    category: "Electronics",
    brand: "Apple",
    stock: 20,
    images: JSON.stringify([
      "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=800&q=80",
      "https://images.unsplash.com/photo-1589739900243-4b52cd9b104e?w=800&q=80",
    ]),
  },
  {
    title: "Wildhorn Men's Leather Wallet",
    description:
      "Handcrafted from premium genuine hunter leather, this wallet features a slim design with 8 card slots, a transparent ID window, and a spacious currency compartment. RFID protected.",
    price: 699,
    originalPrice: 1499,
    discount: 53,
    rating: 4.2,
    reviewCount: 15423,
    category: "Fashion",
    brand: "Wildhorn",
    stock: 400,
    images: JSON.stringify([
      "https://images.unsplash.com/photo-1627123424574-724758594e93?w=800&q=80",
      "https://images.unsplash.com/photo-1601924994987-69e26d50dc26?w=800&q=80",
    ]),
  },
  {
    title: "Casio Vintage Digital Gold Watch",
    description:
      "The classic digital watch in a premium gold-plated finish. Features a daily alarm, hourly time signal, auto-calendar, water resistance, and a warm amber LED backlight.",
    price: 5295,
    originalPrice: 5995,
    discount: 11,
    rating: 4.6,
    reviewCount: 6321,
    category: "Fashion",
    brand: "Casio",
    stock: 150,
    images: JSON.stringify([
      "https://images.unsplash.com/photo-1522312346375-d1a52e2b99b3?w=800&q=80",
      "https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=800&q=80",
    ]),
  },
  {
    title: "Ray-Ban Wayfarer Classic Polarized",
    description:
      "The most recognizable style in the history of sunglasses. The Wayfarer Classic features polarized green classic G-15 lenses that eliminate glare and provide 100% UV protection.",
    price: 14790,
    originalPrice: 16990,
    discount: 12,
    rating: 4.8,
    reviewCount: 2314,
    category: "Fashion",
    brand: "Ray-Ban",
    stock: 45,
    images: JSON.stringify([
      "https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=800&q=80",
      "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=800&q=80",
    ]),
  },
  {
    title: "Solimo Premium Cotton Bedsheet (Double)",
    description:
      "Made from 100% premium cotton with a thread count of 144, this double bedsheet comes with 2 pillow covers. High-quality colors resist fading and the fabric is pre-shrunk.",
    price: 899,
    originalPrice: 1599,
    discount: 43,
    rating: 4.3,
    reviewCount: 7891,
    category: "Home",
    brand: "Solimo",
    stock: 300,
    images: JSON.stringify([
      "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=800&q=80",
      "https://images.unsplash.com/photo-1631679706909-1844bbd07221?w=800&q=80",
    ]),
  },
  {
    title: "Philips Air Fryer 4.1L",
    description:
      "Cook healthy with up to 90% less fat. Features Rapid Air technology for crispy outsides and tender insides. Easy to use with analog timer and temperature control knobs.",
    price: 6799,
    originalPrice: 9999,
    discount: 32,
    rating: 4.5,
    reviewCount: 14502,
    category: "Home",
    brand: "Philips",
    stock: 90,
    images: JSON.stringify([
      "https://images.unsplash.com/photo-1621972750749-0fbb1abb7736?w=800&q=80",
      "https://images.unsplash.com/photo-1584269600464-37b1b58a9fe7?w=800&q=80",
    ]),
  },
  {
    title: "Roborock S8 Robot Vacuum Cleaner",
    description:
      "Forget about cleaning. The Roborock S8 features 6000Pa extreme suction, DuoRoller brush for double cleaning power, VibraRise mopping system, and Reactive 3D obstacle avoidance.",
    price: 54999,
    originalPrice: 69999,
    discount: 21,
    rating: 4.7,
    reviewCount: 843,
    category: "Home",
    brand: "Roborock",
    stock: 12,
    images: JSON.stringify([
      "https://images.unsplash.com/photo-1618172193763-c511deb635ca?w=800&q=80",
      "https://images.unsplash.com/photo-1562408590-e32931084e23?w=800&q=80",
    ]),
  },
  {
    title: "Cosco Light Cricket Tennis Ball (Pack of 6)",
    description:
      "Perfect for recreational or tournament street cricket. These balls feature a high-quality felt coating and a durable rubber core, providing consistent bounce and lifespan.",
    price: 399,
    originalPrice: 599,
    discount: 33,
    rating: 4.3,
    reviewCount: 9540,
    category: "Sports",
    brand: "Cosco",
    stock: 600,
    images: JSON.stringify([
      "https://images.unsplash.com/photo-1587280501635-68a0e82cd5ff?w=800&q=80",
      "https://images.unsplash.com/photo-1530549387789-4c1017266635?w=800&q=80",
    ]),
  },
  {
    title: "Decathlon Kipsta Football Goal (Net Included)",
    description:
      "Enjoy backyard football games with a stable and robust steel structure. This goal is easy to assemble with tool-free interlocking parts. Suitable for all weather conditions.",
    price: 4999,
    originalPrice: 6499,
    discount: 23,
    rating: 4.5,
    reviewCount: 384,
    category: "Sports",
    brand: "Decathlon",
    stock: 40,
    images: JSON.stringify([
      "https://images.unsplash.com/photo-1551958219-acbc608c6377?w=800&q=80",
      "https://images.unsplash.com/photo-1518063319789-7217e6706b04?w=800&q=80",
    ]),
  },
  {
    title: "Bowflex SelectTech 552 Adjustable Dumbbells",
    description:
      "Replace an entire rack of 15 dumbbells with a single pair of Bowflex SelectTech. Easily adjusts from 5 to 52.5 lbs with a turn of a dial. Durable mold around metal plates for quiet workouts.",
    price: 34999,
    originalPrice: 42999,
    discount: 18,
    rating: 4.8,
    reviewCount: 4721,
    category: "Sports",
    brand: "Bowflex",
    stock: 14,
    images: JSON.stringify([
      "https://images.unsplash.com/photo-1638536532686-d610adfc8e5c?w=800&q=80",
      "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=800&q=80",
    ]),
  }
];

function generateMoreProducts() {
  const electronicsBrands = ["Sony", "Dell", "HP", "Anker", "Noise", "Zebronics", "Crucial", "Seagate", "Logitech"];
  const fashionBrands = ["Nike", "Adidas", "Puma", "Zara", "H&M", "Roadster", "Woodland", "Allen Solly"];
  const homeBrands = ["IKEA", "Philips", "Borosil", "Solimo", "Prestige", "Hawkins", "Pigeon", "Sleepwell"];
  const sportsBrands = ["Nivia", "Wilson", "Cosco", "Decathlon", "Yonex", "Speedo", "Spalding", "SG"];

  const electronicsImages = [
    "https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=800&q=80",
    "https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?w=800&q=80",
    "https://images.unsplash.com/photo-1591337676887-a217a6970a8a?w=800&q=80",
    "https://images.unsplash.com/photo-1574944985070-8f3ebc6b79d2?w=800&q=80",
    "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80",
    "https://images.unsplash.com/photo-1484704849700-f032a568e944?w=800&q=80",
    "https://images.unsplash.com/photo-1524678606370-a47ad25cb82a?w=800&q=80",
    "https://images.unsplash.com/photo-1487215078519-e21cc028cb29?w=800&q=80",
    "https://images.unsplash.com/photo-1593784991095-a205069470b6?w=800&q=80",
    "https://images.unsplash.com/photo-1461151304267-38535e780c79?w=800&q=80",
    "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=800&q=80",
    "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&q=80",
    "https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?w=800&q=80",
    "https://images.unsplash.com/photo-1540829917886-91ab031b1764?w=800&q=80",
    "https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=800&q=80",
    "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=800&q=80",
    "https://images.unsplash.com/photo-1510127034890-ba27508e9f1c?w=800&q=80",
    "https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=800&q=80",
    "https://images.unsplash.com/photo-1583394838336-acd977736f90?w=800&q=80",
    "https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=800&q=80",
    "https://images.unsplash.com/photo-1512054502232-10a0a035d672?w=800&q=80",
    "https://images.unsplash.com/photo-1593305841991-05c297ba4575?w=800&q=80",
    "https://images.unsplash.com/photo-1593118247619-e2d6f056869e?w=800&q=80",
    "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=800&q=80",
    "https://images.unsplash.com/photo-1589256469067-ea99122bbdc4?w=800&q=80",
    "https://images.unsplash.com/photo-1622979135225-d2ba269cf1ac?w=800&q=80",
    "https://images.unsplash.com/photo-1592478411213-6153e4ebc07d?w=800&q=80",
    "https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=800&q=80",
    "https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?w=800&q=80",
    "https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=800&q=80",
    "https://images.unsplash.com/photo-1606813907291-d86efa9b94db?w=800&q=80",
    "https://images.unsplash.com/photo-1544816155-12df9643f363?w=800&q=80",
    "https://images.unsplash.com/photo-1591405351990-4726e331f141?w=800&q=80",
    "https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=800&q=80",
    "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=800&q=80",
    "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=800&q=80",
    "https://images.unsplash.com/photo-1589739900243-4b52cd9b104e?w=800&q=80"
  ];

  const fashionImages = [
    "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&q=80",
    "https://images.unsplash.com/photo-1600185365926-3a2ce3cdb9eb?w=800&q=80",
    "https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=800&q=80",
    "https://images.unsplash.com/photo-1579338559194-a162d19bf842?w=800&q=80",
    "https://images.unsplash.com/photo-1542272604-787c3835535d?w=800&q=80",
    "https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=800&q=80",
    "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=800&q=80",
    "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800&q=80",
    "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=800&q=80",
    "https://images.unsplash.com/photo-1562157873-818bc0726f68?w=800&q=80",
    "https://images.unsplash.com/photo-1529374255404-311a2a4f1fd9?w=800&q=80",
    "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=800&q=80",
    "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=800&q=80",
    "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&q=80",
    "https://images.unsplash.com/photo-1544923246-77307dd654cb?w=800&q=80",
    "https://images.unsplash.com/photo-1581655353564-df123a1eb820?w=800&q=80",
    "https://images.unsplash.com/photo-1503342394128-c104d54dba01?w=800&q=80",
    "https://images.unsplash.com/photo-1582966772680-860e372bb558?w=800&q=80",
    "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=800&q=80",
    "https://images.unsplash.com/photo-1627123424574-724758594e93?w=800&q=80",
    "https://images.unsplash.com/photo-1601924994987-69e26d50dc26?w=800&q=80",
    "https://images.unsplash.com/photo-1522312346375-d1a52e2b99b3?w=800&q=80",
    "https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=800&q=80",
    "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=800&q=80",
    "https://images.unsplash.com/photo-1508296695146-257a814070b4?w=800&q=80",
    "https://images.unsplash.com/photo-1574258495973-f010dfbb5371?w=800&q=80",
    "https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=800&q=80"
  ];

  const homeImages = [
    "https://images.unsplash.com/photo-1505693314120-0d443867891c?w=800&q=80",
    "https://images.unsplash.com/photo-1540518614846-7eded433c457?w=800&q=80",
    "https://images.unsplash.com/photo-1556020685-ae41abfc9365?w=800&q=80",
    "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=800&q=80",
    "https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?w=800&q=80",
    "https://images.unsplash.com/photo-1513694203232-719a280e022f?w=800&q=80",
    "https://images.unsplash.com/photo-1600121848594-d8644e57abab?w=800&q=80",
    "https://images.unsplash.com/photo-1585515320310-259814833e62?w=800&q=80",
    "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&q=80",
    "https://images.unsplash.com/photo-1556909172-8c2f041fca1e?w=800&q=80",
    "https://images.unsplash.com/photo-1574269909862-7e1d70bb8078?w=800&q=80",
    "https://images.unsplash.com/photo-1511920170033-f8396924c348?w=800&q=80",
    "https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?w=800&q=80",
    "https://images.unsplash.com/photo-1558562805-4bf1e2a724eb?w=800&q=80",
    "https://images.unsplash.com/photo-1590846406792-0adc7f938f1d?w=800&q=80",
    "https://images.unsplash.com/photo-1601004890684-d8cbf643f5f2?w=800&q=80",
    "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=800&q=80",
    "https://images.unsplash.com/photo-1631679706909-1844bbd07221?w=800&q=80",
    "https://images.unsplash.com/photo-1621972750749-0fbb1abb7736?w=800&q=80",
    "https://images.unsplash.com/photo-1584269600464-37b1b58a9fe7?w=800&q=80",
    "https://images.unsplash.com/photo-1618172193763-c511deb635ca?w=800&q=80",
    "https://images.unsplash.com/photo-1562408590-e32931084e23?w=800&q=80"
  ];

  const sportsImages = [
    "https://images.unsplash.com/photo-1560769629-975ec94e6a86?w=800&q=80",
    "https://images.unsplash.com/photo-1515955656352-a1fa3ffcd111?w=800&q=80",
    "https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=800&q=80",
    "https://images.unsplash.com/photo-1434494878577-86c23bcb06b9?w=800&q=80",
    "https://images.unsplash.com/photo-1554068865-24cecd4e34b8?w=800&q=80",
    "https://images.unsplash.com/photo-1599586120429-48281b6f0ece?w=800&q=80",
    "https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?w=800&q=80",
    "https://images.unsplash.com/photo-1592419044706-39796d40f98c?w=800&q=80",
    "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800&q=80",
    "https://images.unsplash.com/photo-1518611012118-696072aa579a?w=800&q=80",
    "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&q=80",
    "https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=800&q=80",
    "https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=800&q=80",
    "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=800&q=80",
    "https://images.unsplash.com/photo-1485965120184-e220f721d03e?w=800&q=80",
    "https://images.unsplash.com/photo-1587280501635-68a0e82cd5ff?w=800&q=80",
    "https://images.unsplash.com/photo-1530549387789-4c1017266635?w=800&q=80",
    "https://images.unsplash.com/photo-1551958219-acbc608c6377?w=800&q=80",
    "https://images.unsplash.com/photo-1518063319789-7217e6706b04?w=800&q=80",
    "https://images.unsplash.com/photo-1638536532686-d610adfc8e5c?w=800&q=80",
    "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=800&q=80"
  ];

  const electronicsTemplates = [
    { title: "Wireless Soundbar with Subwoofer", desc: "Experience immersive cinema-quality surround sound audio at home featuring deep dynamic bass, multiple input modes, and an elegant slim design.", priceMin: 4999, priceMax: 18999, discount: 25 },
    { title: "Smartwatch Active with Heart Rate Monitor", desc: "A sleek smart fitness companion tracking steps, sleep, exercises, stress, and continuous heart rate. 1.4-inch AMOLED touch display.", priceMin: 3499, priceMax: 9999, discount: 30 },
    { title: "10000mAh Dual Port Fast Power Bank", desc: "Super-compact mobile power supply equipped with Power Delivery technology, short-circuit protection, and LED power level indicators.", priceMin: 899, priceMax: 1999, discount: 45 },
    { title: "Mechanical RGB Backlit Gaming Keyboard", desc: "Professional tactile mechanical keys, customizable RGB illumination patterns, and solid build quality designed for fast typing and intense gaming.", priceMin: 1999, priceMax: 6999, discount: 20 },
    { title: "27-inch IPS UHD Business Monitor", desc: "Ultra-sharp 4K display with high color accuracy, frameless construction, eye-comfort blue light filter, and dual HDMI ports.", priceMin: 16999, priceMax: 29999, discount: 15 },
    { title: "Compact Bluetooth Soundbar for Desktop", desc: "Dual audio channels delivering crisp vocals and deep tones. Perfectly fits under any computer monitor or TV for clear sound.", priceMin: 1499, priceMax: 3499, discount: 40 },
    { title: "Braided 60W USB-C to USB-C Cable (2m)", desc: "Reinforced cable build designed to withstand high bends. Supports fast charging speeds and super-speed data synchronization.", priceMin: 299, priceMax: 799, discount: 50 },
    { title: "Wireless Bluetooth Earbuds Pro", desc: "Active noise-canceling wireless earbuds featuring long battery lifespan, quick charging case, water-resistance, and ergonomic custom fit.", priceMin: 2499, priceMax: 12999, discount: 35 }
  ];

  const fashionTemplates = [
    { title: "Men's Cotton Slim Fit Polo Shirt", desc: "Crafted from 100% fine cotton pique, featuring double-needle stitched seams, side vents, and a clean classic flat collar.", priceMin: 899, priceMax: 2499, discount: 30 },
    { title: "Unisex Everyday Carry Canvas Backpack", desc: "Spacious heavy-duty canvas bag complete with a padded laptop sleeve, dual mesh drink pockets, and comfortable adjustable straps.", priceMin: 1299, priceMax: 3999, discount: 25 },
    { title: "Lightweight Athletic Running Shorts", desc: "Sweat-wicking synthetic running shorts with reflective graphics, soft inner lining, and secure zip storage for small essentials.", priceMin: 699, priceMax: 1899, discount: 40 },
    { title: "Genuine Italian Leather Dress Belt", desc: "Top-grain premium cowhide leather belt finished with a polished satin buckle, versatile styling matching suit trousers or denim.", priceMin: 599, priceMax: 1499, discount: 35 },
    { title: "Polarized Retro Clubmaster Sunglasses", desc: "Sleek combination metal-acetate frame featuring HD polarized UV400 lenses that enhance color clarity and eliminate glare.", priceMin: 1299, priceMax: 5999, discount: 20 },
    { title: "Memory Foam Cushioned Walking Shoes", desc: "Step in comfort. Breathable mesh slip-ons featuring a flexible traction outer sole and high-rebound cushioning foam.", priceMin: 1899, priceMax: 4999, discount: 30 },
    { title: "Women's Comfort Stretch Denim Jacket", desc: "Timeless fashion layer featuring button closures, chest button flap pockets, and elastane blend for flexible casual wear.", priceMin: 1999, priceMax: 4499, discount: 25 },
    { title: "Premium Wool Blend Winter Scarf", desc: "Super-soft warm winter scarf finished with subtle fringe edges. Lightweight design that blocks wind chill during cold weather.", priceMin: 499, priceMax: 1299, discount: 50 }
  ];

  const homeTemplates = [
    { title: "Stainless Steel Vacuum Water Bottle", desc: "Double-wall insulated flask keeping drinks icy cold for 24h or hot for 12h. Standard mouth cap with carry loop. Leakproof.", priceMin: 599, priceMax: 1699, discount: 25 },
    { title: "3-Piece Non-Stick Induction Cookware Set", desc: "Heavy-gauge aluminum pans with a robust non-toxic coating. Includes a deep frying pan, flat griddle tawa, and saucepan.", priceMin: 1899, priceMax: 4999, discount: 35 },
    { title: "Ergonomic Orthopedic Memory Foam Pillow", desc: "Contoured medical pillow designed to align the head and spine, reducing morning neck stiffness and easing breathing patterns.", priceMin: 1199, priceMax: 2899, discount: 40 },
    { title: "Double-Wall Cool Touch Electric Kettle", desc: "Fast-boiling cordless jug featuring high-grade stainless inner liner, automatic shut-off safety, and dry-boil cutoff.", priceMin: 999, priceMax: 2499, discount: 30 },
    { title: "Ultra-Absorbent Microfiber Towels (Pack of 6)", desc: "Quick-drying lint-free kitchen towels perfect for cleaning glass, polishing dinnerware, or wiping tables dry.", priceMin: 299, priceMax: 799, discount: 45 },
    { title: "Adjustable Brightness LED Desk Study Lamp", desc: "Flexible gooseneck lamp offering multiple color temperatures, touch switches, and an integrated smartphone wireless charger.", priceMin: 1299, priceMax: 3499, discount: 20 },
    { title: "Ceramic Decorative Flower Vase Set", desc: "Two elegantly glazed hand-crafted white ceramic vases, styling shelves, desks, or living spaces with minimal modern accents.", priceMin: 799, priceMax: 2299, discount: 30 },
    { title: "Anti-Skid Cotton Memory Foam Bath Mat", desc: "Super absorbent bathroom rug filled with high-density polyurethane memory foam that rebounds comfortably under foot.", priceMin: 499, priceMax: 1299, discount: 50 }
  ];

  const sportsTemplates = [
    { title: "High-Tension Carbon Badminton Racket", desc: "Isometric head frame shape constructed from high-modulus graphite. Increases sweet-spot area for aggressive hitting control.", priceMin: 1599, priceMax: 5499, discount: 25 },
    { title: "Alum-Tanned Leather Cricket Seam Ball", desc: "Regulation size hand-stitched leather ball with thick wool-cork core, delivering true seam bounce and durable paint gloss.", priceMin: 450, priceMax: 1290, discount: 30 },
    { title: "High-Absorbent Non-Slip Grip Tape (Pack of 5)", desc: "Soft-touch dry racket overgrip wraps that absorb hand sweat instantly, preventing slips during high-power matches.", priceMin: 199, priceMax: 599, discount: 50 },
    { title: "Anti-Fog Curved Lens Swimming Goggles", desc: "Panoramic underwater vision with leakproof silicone seals, nose bridge adjustments, and adjustable double strap locks.", priceMin: 499, priceMax: 1499, discount: 40 },
    { title: "Indoor/Outdoor Composite Leather Basketball", desc: "Deep channel design with custom pebbled skin ensuring exceptional palm grip, consistent air retention, and reliable bounce.", priceMin: 1299, priceMax: 3299, discount: 20 },
    { title: "Steel Cable Digital Skipping Speed Rope", desc: "Weighted ergonomic handle skipping rope with built-in LCD tracker counting rotations, calorie burns, and timer metrics.", priceMin: 349, priceMax: 999, discount: 45 },
    { title: "Durable Neoprene Sports Ankle Support", desc: "Breathable wrap around compression sleeve offering stable joint support and warmth during fitness training or sports rehabilitation.", priceMin: 299, priceMax: 799, discount: 50 },
    { title: "Protective Hard-Shell Sports Shin Guards", desc: "High-impact protection guards lined with soft cushioning foam backing, keeping shins shielded during soccer matches.", priceMin: 399, priceMax: 999, discount: 35 }
  ];

  const categories = [
    { name: "Electronics", templates: electronicsTemplates, brands: electronicsBrands, images: electronicsImages },
    { name: "Fashion", templates: fashionTemplates, brands: fashionBrands, images: fashionImages },
    { name: "Home", templates: homeTemplates, brands: homeBrands, images: homeImages },
    { name: "Sports", templates: sportsTemplates, brands: sportsBrands, images: sportsImages }
  ];

  const generatedProducts: any[] = [];

  // Let's generate 15 products per category (60 total) to expand the catalog to 110 items
  for (const cat of categories) {
    for (let i = 0; i < 15; i++) {
      const template = cat.templates[i % cat.templates.length];
      const brand = cat.brands[Math.floor((i + 3) * 7.3) % cat.brands.length];
      const title = `${brand} ${template.title}`;

      // Pick two distinct images from the pool
      const img1Index = Math.floor(i * 1.7) % cat.images.length;
      let img2Index = (img1Index + 3) % cat.images.length;
      if (img1Index === img2Index) {
        img2Index = (img1Index + 1) % cat.images.length;
      }
      const productImages = [cat.images[img1Index], cat.images[img2Index]];

      // Generate realistic price based on template min/max
      const priceRange = template.priceMax - template.priceMin;
      const step = priceRange / 14;
      const priceVal = Math.round(template.priceMin + (step * i));
      const originalPriceVal = Math.round(priceVal / (1 - template.discount / 100));

      const rating = parseFloat((4.0 + ((i * 7.7) % 1.0)).toFixed(1));
      const reviewCount = Math.floor((i + 1) * 314.7 + 10);
      const stock = Math.floor((i + 2) * 23.3);

      generatedProducts.push({
        title,
        description: template.desc.replace("{brand}", brand),
        price: priceVal,
        originalPrice: originalPriceVal,
        discount: template.discount,
        rating,
        reviewCount,
        category: cat.name,
        brand,
        stock,
        images: JSON.stringify(productImages)
      });
    }
  }

  return generatedProducts;
}

async function main() {
  console.log("🌱 Starting database seed...");

  // Clear existing data
  await prisma.cartItem.deleteMany();
  await prisma.product.deleteMany();
  await prisma.user.deleteMany();

  // Create demo user
  const hashedPassword = await bcrypt.hash("demo1234", 12);
  await prisma.user.create({
    data: {
      name: "Demo User",
      email: "demo@shopwave.com",
      password: hashedPassword,
    },
  });

  // Generate programmatic products
  const extraProducts = generateMoreProducts();
  const allProducts = [...products, ...extraProducts];

  // Create products in bulk to manage storage workload and performance
  console.log(`Seeding ${allProducts.length} products in bulk...`);
  await prisma.product.createMany({
    data: allProducts,
  });

  console.log(`✅ Seeded ${allProducts.length} products and 1 demo user.`);
  console.log("📧 Demo login: demo@shopwave.com / demo1234");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
