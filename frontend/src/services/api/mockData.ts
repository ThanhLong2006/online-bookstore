import type { Book, Category, PageResult } from '../../types/book'

export const mockCategories: Category[] = [
  { id: 'fiction', name: 'Tiểu thuyết', slug: 'tieu-thuyet' },
  { id: 'business', name: 'Kinh doanh', slug: 'kinh-doanh' },
  { id: 'self-help', name: 'Kỹ năng', slug: 'ky-nang' },
  { id: 'tech', name: 'Công nghệ', slug: 'cong-nghe' },
  { id: 'kids', name: 'Thiếu nhi', slug: 'thieu-nhi' },
]

const now = Date.now()

export const mockBooks: Book[] = [
  {
    id: 1,
    title: 'Atomic Habits',
    author: 'James Clear',
    publisher: 'Avery',
    year: 2018,
    pages: 320,
    price: 189000,
    originalPrice: 239000,
    discountPercent: 20,
    rating: 4.8,
    ratingCount: 12840,
    sold: 32450,
    views: 210345,
    isNew: true,
    coverUrl:
      'https://covers.openlibrary.org/b/id/8225266-L.jpg',
    category: mockCategories.find((c) => c.id === 'self-help'),
    stock: 12,
    createdAt: new Date(now - 1000 * 60 * 60 * 24 * 2).toISOString(),
    description:
      'Atomic Habits mang đến một hệ thống xây dựng thói quen dựa trên những thay đổi nhỏ nhưng nhất quán. Thay vì cố gắng “lột xác” chỉ sau một đêm, cuốn sách hướng bạn tập trung vào quy trình: tối ưu môi trường, thiết kế tín hiệu kích hoạt, và củng cố phần thưởng để hành vi tốt trở nên tự nhiên. Tác giả giải thích rõ cơ chế hình thành thói quen, vì sao ý chí thường thất bại, và cách biến mục tiêu lớn thành hành động nhỏ lặp lại. Qua các câu chuyện thực tế và ví dụ dễ áp dụng, bạn sẽ học cách bắt đầu từ việc “trở thành người như thế nào”, rồi mới đến “làm điều gì”. Đây là lựa chọn phù hợp cho người muốn cải thiện hiệu suất làm việc, sức khoẻ, học tập và kỷ luật cá nhân một cách bền vững.',
  },
  {
    id: 2,
    title: 'Clean Code',
    author: 'Robert C. Martin',
    publisher: 'Prentice Hall',
    year: 2008,
    pages: 464,
    price: 299000,
    originalPrice: 359000,
    discountPercent: 17,
    rating: 4.7,
    ratingCount: 8421,
    sold: 15420,
    views: 180120,
    coverUrl:
      'https://covers.openlibrary.org/b/id/9641996-L.jpg',
    category: mockCategories.find((c) => c.id === 'tech'),
    stock: 8,
    createdAt: new Date(now - 1000 * 60 * 60 * 24 * 6).toISOString(),
    description:
      'Clean Code là “kim chỉ nam” cho lập trình viên muốn viết phần mềm dễ đọc và dễ bảo trì. Cuốn sách không chỉ nói về phong cách, mà đi sâu vào tư duy thiết kế: đặt tên rõ nghĩa, hàm ngắn gọn, tách trách nhiệm, xử lý lỗi đúng cách và giảm phụ thuộc. Thông qua ví dụ refactor chi tiết, bạn sẽ thấy sự khác biệt giữa code “chạy được” và code “đáng tin cậy”. Những nguyên tắc trong Clean Code giúp đội nhóm giảm chi phí bảo trì, tăng tốc phát triển tính năng và hạn chế bug phát sinh. Nếu bạn đang xây dựng sản phẩm dài hạn hoặc làm việc trong team, đây là tài liệu nên đọc để nâng chuẩn chất lượng code và kỷ luật kỹ thuật.',
  },
  {
    id: 3,
    title: 'Dune',
    author: 'Frank Herbert',
    publisher: 'Chilton Books',
    year: 1965,
    pages: 688,
    price: 219000,
    originalPrice: 219000,
    rating: 4.6,
    ratingCount: 22015,
    sold: 9830,
    views: 99010,
    coverUrl:
      'https://covers.openlibrary.org/b/id/8101343-L.jpg',
    category: mockCategories.find((c) => c.id === 'fiction'),
    stock: 6,
    createdAt: new Date(now - 1000 * 60 * 60 * 24 * 9).toISOString(),
    description:
      'Dune là tác phẩm khoa học viễn tưởng kinh điển kết hợp chính trị, tôn giáo và sinh thái học trong một thế giới rộng lớn. Bối cảnh xoay quanh hành tinh sa mạc Arrakis – nơi duy nhất sản sinh “spice”, tài nguyên quý giá điều khiển quyền lực của cả đế chế. Câu chuyện theo chân Paul Atreides khi gia tộc bị cuốn vào âm mưu tranh giành, buộc anh phải thích nghi, trưởng thành và đối mặt với định mệnh. Dune hấp dẫn bởi hệ thống thế giới sâu sắc, nhân vật có chiều sâu và những câu hỏi về quyền lực, niềm tin và hậu quả của lựa chọn. Đây là cuốn sách phù hợp cho người yêu thích sử thi, chiến lược và những câu chuyện có tầm vóc triết học.',
  },
  {
    id: 4,
    title: 'The Lean Startup',
    author: 'Eric Ries',
    publisher: 'Crown Business',
    year: 2011,
    pages: 336,
    price: 199000,
    originalPrice: 249000,
    discountPercent: 20,
    rating: 4.5,
    ratingCount: 5120,
    sold: 12110,
    views: 77500,
    coverUrl:
      'https://covers.openlibrary.org/b/id/6979861-L.jpg',
    category: mockCategories.find((c) => c.id === 'business'),
    stock: 15,
    createdAt: new Date(now - 1000 * 60 * 60 * 24 * 12).toISOString(),
    description:
      'The Lean Startup giới thiệu cách xây dựng sản phẩm trong điều kiện không chắc chắn bằng vòng lặp Build–Measure–Learn. Thay vì làm một kế hoạch dài rồi hy vọng thành công, bạn tạo MVP, đo lường hành vi người dùng, học nhanh và điều chỉnh liên tục. Cuốn sách giúp bạn phân biệt “tăng trưởng thật” với những chỉ số ảo, đồng thời đưa ra các chiến thuật kiểm thử giả thuyết, cải tiến sản phẩm và tối ưu mô hình kinh doanh. Đây là lựa chọn phù hợp cho founder, product manager, marketer và bất kỳ ai tham gia xây dựng sản phẩm số. Lean không chỉ là tốc độ, mà là học đúng thứ cần học để tránh lãng phí thời gian và nguồn lực.',
  },
  {
    id: 5,
    title: 'Harry Potter (Bản minh hoạ)',
    author: 'J.K. Rowling',
    publisher: 'Bloomsbury',
    year: 1997,
    pages: 256,
    price: 259000,
    originalPrice: 309000,
    discountPercent: 16,
    rating: 4.9,
    ratingCount: 40210,
    sold: 60210,
    views: 450000,
    isNew: true,
    coverUrl:
      'https://covers.openlibrary.org/b/id/10521270-L.jpg',
    category: mockCategories.find((c) => c.id === 'kids'),
    stock: 20,
    createdAt: new Date(now - 1000 * 60 * 60 * 24 * 1).toISOString(),
    description:
      'Harry Potter phiên bản minh hoạ mang lại trải nghiệm đọc giàu hình ảnh, phù hợp cho cả thiếu nhi và người sưu tầm. Thế giới phù thuỷ được tái hiện bằng nét vẽ chi tiết, giúp câu chuyện trở nên sống động hơn qua từng trang. Đây là hành trình về tình bạn, lòng dũng cảm và sự trưởng thành khi Harry bước vào Hogwarts, khám phá thân phận và đối mặt với những bí ẩn. Bản minh hoạ đặc biệt phù hợp để đọc cùng gia đình, làm quà tặng, hoặc bổ sung vào tủ sách như một ấn bản đẹp. Nếu bạn yêu thích không khí kỳ ảo, nhẹ nhàng nhưng cuốn hút, đây là lựa chọn rất đáng cân nhắc.',
  },
  {
    id: 6,
    title: 'Deep Work',
    author: 'Cal Newport',
    publisher: 'Grand Central Publishing',
    year: 2016,
    pages: 304,
    price: 179000,
    originalPrice: 229000,
    discountPercent: 22,
    rating: 4.6,
    ratingCount: 10980,
    sold: 24560,
    views: 210500,
    coverUrl:
      'https://covers.openlibrary.org/b/id/10523394-L.jpg',
    category: mockCategories.find((c) => c.id === 'self-help'),
    stock: 10,
    createdAt: new Date(now - 1000 * 60 * 60 * 24 * 4).toISOString(),
    description:
      'Deep Work khẳng định tập trung sâu là một kỹ năng hiếm nhưng cực kỳ giá trị trong thời đại xao nhãng. Cuốn sách hướng dẫn cách tạo môi trường làm việc giúp bạn đi vào trạng thái tập trung, hạn chế phân tán từ mạng xã hội, email và cuộc họp dày đặc. Tác giả đưa ra các nguyên tắc thực hành: lên lịch làm việc sâu, thiết kế thói quen, đo lường kết quả và “tập luyện” khả năng tập trung như một cơ bắp. Bên cạnh đó là các câu chuyện từ những người tạo ra thành tựu lớn nhờ kỷ luật tập trung. Nếu bạn muốn nâng hiệu suất, học nhanh hơn và làm ra sản phẩm chất lượng, Deep Work là một lựa chọn rất thực tế.',
  },
  {
    id: 7,
    title: 'Nhà giả kim',
    author: 'Paulo Coelho',
    publisher: 'HarperOne',
    year: 1993,
    pages: 208,
    price: 99000,
    originalPrice: 129000,
    discountPercent: 23,
    rating: 4.4,
    ratingCount: 18020,
    sold: 33210,
    views: 275400,
    coverUrl:
      'https://covers.openlibrary.org/b/id/10518529-L.jpg',
    category: mockCategories.find((c) => c.id === 'fiction'),
    stock: 25,
    createdAt: new Date(now - 1000 * 60 * 60 * 24 * 15).toISOString(),
    description:
      'Nhà giả kim là câu chuyện ngắn gọn nhưng giàu biểu tượng về hành trình đi tìm “kho báu” và khám phá bản thân. Nhân vật chính rời bỏ vùng đất quen thuộc, băng qua sa mạc, gặp gỡ nhiều con người và trải nghiệm để hiểu điều mình thật sự theo đuổi. Cuốn sách truyền cảm hứng bằng giọng văn giản dị, khuyến khích bạn lắng nghe trái tim, dũng cảm lựa chọn và tin vào “dấu hiệu” trên đường đi. Không phải ai cũng đọc Nhà giả kim theo cùng một cách: có người thấy đó là câu chuyện về ước mơ, có người coi là triết lý sống. Dù thế nào, đây vẫn là lựa chọn dễ đọc, giàu động lực và phù hợp để tặng.',
  },
  {
    id: 8,
    title: 'Eloquent JavaScript',
    author: 'Marijn Haverbeke',
    publisher: 'No Starch Press',
    year: 2018,
    pages: 472,
    price: 269000,
    originalPrice: 319000,
    discountPercent: 16,
    rating: 4.5,
    ratingCount: 6230,
    sold: 8920,
    views: 94000,
    coverUrl:
      'https://covers.openlibrary.org/b/id/10523325-L.jpg',
    category: mockCategories.find((c) => c.id === 'tech'),
    stock: 7,
    createdAt: new Date(now - 1000 * 60 * 60 * 24 * 7).toISOString(),
    description:
      'Eloquent JavaScript dẫn dắt bạn từ nền tảng ngôn ngữ tới cách tư duy lập trình hiện đại, kèm bài tập thực hành để “cầm tay chỉ việc”. Cuốn sách không chỉ dạy cú pháp mà còn giúp bạn hiểu rõ cấu trúc dữ liệu, hàm bậc cao, xử lý bất đồng bộ, DOM và cách xây dựng chương trình có tổ chức. Các chương cuối cung cấp dự án nhỏ giúp bạn áp dụng kiến thức vào thực tế. Đây là lựa chọn phù hợp cho người học JavaScript nghiêm túc, muốn xây nền tảng vững chắc để làm web frontend/backend. Nếu bạn thích học theo kiểu hiểu bản chất và luyện tập, Eloquent JavaScript là cuốn rất đáng đọc.',
  },
  {
    id: 9,
    title: 'Start With Why',
    author: 'Simon Sinek',
    publisher: 'Portfolio',
    year: 2009,
    pages: 256,
    price: 159000,
    originalPrice: 199000,
    discountPercent: 20,
    rating: 4.3,
    ratingCount: 4100,
    sold: 7350,
    views: 52000,
    coverUrl:
      'https://covers.openlibrary.org/b/id/10522251-L.jpg',
    category: mockCategories.find((c) => c.id === 'business'),
    stock: 9,
    createdAt: new Date(now - 1000 * 60 * 60 * 24 * 10).toISOString(),
    description:
      'Start With Why tập trung vào câu hỏi đơn giản nhưng mạnh mẽ: “Vì sao bạn làm điều đó?”. Tác giả cho rằng những cá nhân và tổ chức truyền cảm hứng luôn bắt đầu từ WHY, sau đó mới đến HOW và WHAT. Cuốn sách trình bày mô hình Golden Circle, kèm ví dụ từ Apple, Martin Luther King Jr. và nhiều thương hiệu khác. Nội dung phù hợp cho người làm quản lý, marketing, xây dựng thương hiệu hoặc bất kỳ ai muốn làm rõ động lực cốt lõi để tạo ra ảnh hưởng. Khi bạn hiểu WHY, việc ra quyết định, định vị và dẫn dắt đội nhóm trở nên nhất quán hơn. Đây là cuốn dễ đọc và rất hữu ích để “đặt lại nền” cho chiến lược.',
  },
  {
    id: 10,
    title: 'The Very Hungry Caterpillar',
    author: 'Eric Carle',
    publisher: 'World Publishing Company',
    year: 1969,
    pages: 32,
    price: 79000,
    originalPrice: 99000,
    discountPercent: 20,
    rating: 4.7,
    ratingCount: 9050,
    sold: 28000,
    views: 130000,
    coverUrl:
      'https://covers.openlibrary.org/b/id/8774576-L.jpg',
    category: mockCategories.find((c) => c.id === 'kids'),
    stock: 30,
    createdAt: new Date(now - 1000 * 60 * 60 * 24 * 3).toISOString(),
    description:
      'The Very Hungry Caterpillar là một trong những cuốn sách tranh thiếu nhi nổi tiếng nhất thế giới. Hành trình của chú sâu nhỏ từ lúc nở ra cho đến khi hoá bướm được kể bằng ngôn ngữ đơn giản, hình minh hoạ rực rỡ và nhịp điệu dễ nhớ. Cuốn sách giúp trẻ làm quen với các khái niệm cơ bản như ngày trong tuần, đếm số, và thói quen ăn uống, đồng thời khơi gợi tình yêu đọc sách từ rất sớm. Đây là lựa chọn tuyệt vời để bố mẹ đọc cùng con, tạo thời gian gắn kết và hình thành thói quen đọc mỗi ngày.',
  },
]

function includesIgnoreCase(haystack: string, needle: string) {
  return haystack.toLowerCase().includes(needle.toLowerCase())
}

export function mockGetCategories(): Category[] {
  return mockCategories
}

export function mockGetBooks(params?: {
  q?: string
  categoryId?: string | number
  minPrice?: number
  maxPrice?: number
  page?: number
  pageSize?: number
  sort?: 'newest' | 'price_asc' | 'price_desc'
}): PageResult<Book> {
  const q = params?.q?.trim() ?? ''
  const categoryId = params?.categoryId
  const minPrice = params?.minPrice
  const maxPrice = params?.maxPrice
  const page = Math.max(1, Number(params?.page ?? 1) || 1)
  const pageSize = Math.max(1, Math.min(48, Number(params?.pageSize ?? 12) || 12))
  const sort = params?.sort ?? 'newest'

  let items = [...mockBooks]

  if (categoryId !== undefined && categoryId !== null && categoryId !== '') {
    items = items.filter((b) => String(b.category?.id ?? '') === String(categoryId))
  }

  if (q) {
    items = items.filter(
      (b) =>
        includesIgnoreCase(b.title, q) ||
        (b.author ? includesIgnoreCase(b.author, q) : false) ||
        (b.category?.name ? includesIgnoreCase(b.category.name, q) : false),
    )
  }

  if (typeof minPrice === 'number' && !Number.isNaN(minPrice)) {
    items = items.filter((b) => b.price >= minPrice)
  }
  if (typeof maxPrice === 'number' && !Number.isNaN(maxPrice)) {
    items = items.filter((b) => b.price <= maxPrice)
  }

  items.sort((a, b) => {
    if (sort === 'price_asc') return a.price - b.price
    if (sort === 'price_desc') return b.price - a.price
    const da = a.createdAt ? new Date(a.createdAt).getTime() : 0
    const db = b.createdAt ? new Date(b.createdAt).getTime() : 0
    return db - da
  })

  const total = items.length
  const start = (page - 1) * pageSize
  const paged = items.slice(start, start + pageSize)

  return { items: paged, page, pageSize, total }
}

export function mockGetBook(id: string | number): Book | undefined {
  return mockBooks.find((b) => String(b.id) === String(id))
}

export function mockGetRelatedBooks(book: Book, limit = 6) {
  const catId = book.category?.id
  const items = mockBooks
    .filter((b) => String(b.id) !== String(book.id))
    .filter((b) => (catId ? String(b.category?.id) === String(catId) : true))
    .sort((a, b) => (b.sold ?? 0) - (a.sold ?? 0))
    .slice(0, limit)
  return items
}

export type NewsItem = {
  id: string
  title: string
  date: string
  tag: 'Thông báo' | 'Tin tức' | 'Khuyến mãi'
  coverUrl: string
  excerpt: string
  content: string
}

export const mockNews: NewsItem[] = [
  {
    id: 'ship-tet',
    title: 'Thông báo lịch giao hàng dịp lễ',
    date: 'Hôm nay',
    tag: 'Thông báo',
    coverUrl:
      'https://images.unsplash.com/photo-1521587760476-6c12a4b040da?auto=format&fit=crop&w=1600&q=80',
    excerpt:
      'Cập nhật lịch xử lý đơn và thời gian giao hàng trong dịp lễ để bạn chủ động đặt hàng.',
    content:
      'Để đảm bảo trải nghiệm mua sắm tốt nhất trong dịp lễ, SachStore xin thông báo lịch xử lý đơn hàng như sau: các đơn đặt trước 16:00 sẽ được xác nhận trong ngày; các đơn đặt sau 16:00 sẽ chuyển sang ngày làm việc tiếp theo. Thời gian giao hàng dự kiến có thể dao động 1–2 ngày tuỳ khu vực và đối tác vận chuyển.\n\nChúng tôi khuyến khích bạn đặt sớm các sản phẩm yêu thích để tránh tình trạng hết hàng. Trong thời gian cao điểm, hệ thống vẫn ghi nhận đơn bình thường và sẽ cập nhật trạng thái chi tiết tại mục theo dõi đơn (demo UI). Nếu cần hỗ trợ, bạn có thể liên hệ qua email hỗ trợ hoặc kênh mạng xã hội.',
  },
  {
    id: 'top-self-help',
    title: 'Top 10 sách kỹ năng bán chạy tuần này',
    date: 'Tuần này',
    tag: 'Tin tức',
    coverUrl:
      'https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=1600&q=80',
    excerpt:
      'Những tựa sách giúp nâng hiệu suất và kỷ luật đang được cộng đồng quan tâm nhiều nhất.',
    content:
      'Tuần này, nhóm sách kỹ năng tiếp tục dẫn đầu với các chủ đề về thói quen, tập trung sâu và tối ưu hoá công việc. Điểm chung của các tựa sách bán chạy là tính ứng dụng cao: có khung thực hành, ví dụ cụ thể và dễ áp dụng vào đời sống.\n\nDanh sách top 10 (demo) gồm: Atomic Habits, Deep Work, Start With Why… Mỗi cuốn đều có góc nhìn riêng về động lực, kỷ luật và cách duy trì tiến bộ. Nếu bạn đang muốn bắt đầu hành trình cải thiện bản thân, hãy chọn một cuốn phù hợp với mục tiêu hiện tại và cam kết đọc đều đặn mỗi ngày.',
  },
  {
    id: 'member-sale',
    title: 'Ưu đãi hội viên: giảm thêm 5% cho đơn hàng',
    date: 'Mới',
    tag: 'Khuyến mãi',
    coverUrl:
      'https://images.unsplash.com/photo-1528207776546-365bb710ee93?auto=format&fit=crop&w=1600&q=80',
    excerpt:
      'Chương trình ưu đãi dành cho hội viên giúp bạn mua sách tiết kiệm hơn.',
    content:
      'SachStore triển khai ưu đãi hội viên giảm thêm 5% trên tổng đơn (demo UI). Ưu đãi áp dụng cho nhiều nhóm sách, đặc biệt là sách kỹ năng và công nghệ. Bạn có thể kết hợp với các chương trình giảm giá sẵn có trên từng sản phẩm để tối ưu chi phí.\n\nLưu ý: đây là tính năng mô phỏng cho frontend — phần áp dụng ưu đãi và điều kiện sẽ tuỳ theo backend thực tế. Trong giai đoạn demo, bạn có thể trải nghiệm giao diện hiển thị thông tin ưu đãi và luồng thanh toán/hoá đơn.',
  },
]

export function mockGetNews() {
  return mockNews
}

export function mockGetNewsById(id: string) {
  return mockNews.find((n) => n.id === id)
}

export function mockGetHomeSections() {
  const byNewest = [...mockBooks].sort((a, b) => {
    const da = a.createdAt ? new Date(a.createdAt).getTime() : 0
    const db = b.createdAt ? new Date(b.createdAt).getTime() : 0
    return db - da
  })
  const byViews = [...mockBooks].sort((a, b) => (b.views ?? 0) - (a.views ?? 0))
  const bySold = [...mockBooks].sort((a, b) => (b.sold ?? 0) - (a.sold ?? 0))

  const featuredCollections = [
    { id: 'col-1', title: 'Bộ sưu tập Kỹ năng', subtitle: 'Tập trung – Thói quen – Hiệu suất', items: bySold.slice(0, 4) },
    { id: 'col-2', title: 'Bộ sưu tập Công nghệ', subtitle: 'Clean Code & thực hành', items: byViews.filter((b) => b.category?.id === 'tech').slice(0, 4) },
  ]

  const weeklyRanking = bySold.slice(0, 6)

  const banners = [
    {
      id: 'bn-1',
      title: 'Siêu sale tuần này',
      subtitle: 'Giảm đến 30% cho sách kỹ năng & công nghệ',
      imageUrl: 'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?auto=format&fit=crop&w=1600&q=80',
      href: '/books?sort=price_desc',
    },
    {
      id: 'bn-2',
      title: 'Sách mới cập nhật',
      subtitle: 'Khám phá xu hướng đọc mới nhất',
      imageUrl: 'https://images.unsplash.com/photo-1528207776546-365bb710ee93?auto=format&fit=crop&w=1600&q=80',
      href: '/books?sort=newest',
    },
    {
      id: 'bn-3',
      title: 'Bộ sưu tập nổi bật',
      subtitle: 'Top sách được xem nhiều trong cộng đồng',
      imageUrl: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=1600&q=80',
      href: '/books',
    },
  ]

  const news = mockNews.map((n) => ({ id: n.id, title: n.title, date: n.date, tag: n.tag }))

  return {
    banners,
    sections: {
      newest: byNewest.slice(0, 8),
      mostViewed: byViews.slice(0, 8),
      weeklyRanking,
    },
    featuredCollections,
    news,
  }
}

