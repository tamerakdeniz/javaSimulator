export type Level = "JR" | "JR-MID" | "MID" | "SR";
export type LevelFilter = "ALL" | Level;
export type AiProvider = "local" | "gemini" | "openai" | "claude";
export type SpeechProvider = "browser" | "deepgram";

export type MultipleChoice = {
  options: string[];
  correctIndex: number;
  explanation: string;
};

export type Question = {
  id: string;
  level: Level;
  category: string;
  prompt: string;
  answer: string;
  keywords: string[];
  tags: string[];
  mcq?: MultipleChoice;
  followUps?: string[];
};

export const DEFAULT_NOTES = `Junior Java Developer teknik mulakat odagi:
- Java syntax, JVM/JRE/JDK, OOP, interface, HashMap, exception, collection.
- Spring Boot, Spring MVC, Spring Data JPA, Spring Security, JWT, OAuth2 Resource Server, Keycloak.
- RESTful API, stateless HTTP, endpoint tasarimi, 3. parti API entegrasyonu, OpenFeign.
- SQL, Oracle, ORM, Hibernate/JPA, transaction, pagination, GROUP BY/HAVING.
- Git, Maven/Gradle, debugging, logging, unit test, coverage, clean code.
- Microservice: Gateway, BFF, Kafka, producer/consumer/topic, event-driven architecture, Redis, Config Server.
- Transactional Outbox, retryCount, polling, Debezium CDC, idempotency, order-service/product-service stok akisi.
- Docker, Agile/Scrum, ekip calismasi, AI tool kullanimi, prompt engineering, agent ile calisma.`;

export const DEFAULT_MODELS: Record<AiProvider, string> = {
  local: "local-rubric",
  gemini: "gemini-2.0-flash",
  openai: "gpt-4.1-mini",
  claude: "claude-3-5-haiku-latest",
};

export const QUESTION_BANK: Question[] = [
  {
    id: "java-interface-contract",
    level: "JR",
    category: "Java Core",
    prompt:
      "Interface neden yazılır? Klasik bir Java mülakatında hangi gerekçeler beklenir?",
    answer:
      "Interface bir sınıfın hangi davranışları sunacağını belirleyen sözleşmedir. Bağımlılığı somut sınıfa değil soyut tipe bağlar; polymorphism, testte mock kullanımı, değiştirilebilirlik ve Dependency Inversion için temel sağlar. Örneğin PaymentService doğrudan GarantiPaymentClient yerine PaymentClient interface'ine bağlı olursa farklı sağlayıcılar veya test double'ları kolayca değiştirilebilir.",
    keywords: ["sözleşme", "abstraction", "polymorphism", "dependency inversion", "mock", "test"],
    tags: ["OOP", "Clean Code", "Testing"],
    mcq: {
      options: [
        "Somut sınıfların bytecode üretmesini sağlar.",
        "Davranış sözleşmesi kurar ve bağımlılığı soyutlar.",
        "Sadece static metot yazmak için kullanılır.",
        "Veritabanı tablolarını otomatik oluşturur.",
      ],
      correctIndex: 1,
      explanation:
        "Interface temel olarak sözleşme ve soyutlama sağlar; test edilebilirliği ve değiştirilebilirliği artırır.",
    },
    followUps: [
      "Abstract class ile interface farkını nasıl açıklarsın?",
      "Interface kullanımı unit test yazmayı nasıl kolaylaştırır?",
    ],
  },
  {
    id: "java-hashmap-internals",
    level: "JR-MID",
    category: "Java Core",
    prompt: "HashMap nasıl çalışır? equals ve hashCode hatalı yazılırsa ne olur?",
    answer:
      "HashMap key'in hashCode değerinden bucket index'i hesaplar. Aynı bucket içinde çakışma olursa equals ile gerçek eşitlik kontrol edilir; Java 8 sonrası yoğun çakışmalarda yapı tree bin'e dönebilir. equals ve hashCode tutarlı değilse aynı görünen key bulunamayabilir, duplicate kayıt oluşabilir veya performans ciddi düşer. Mutable alanları key olarak kullanmak da risklidir.",
    keywords: ["hashcode", "equals", "bucket", "collision", "mutable", "tree"],
    tags: ["Collections", "Performance"],
    mcq: {
      options: [
        "Sadece equals kullanır, hashCode önemsizdir.",
        "hashCode bucket seçer, equals aynı bucket içindeki eşitliği doğrular.",
        "Tüm elemanları ekleme sırasına göre tutar.",
        "Key nesnesi mutable olursa lookup daha hızlı olur.",
      ],
      correctIndex: 1,
      explanation:
        "HashMap önce hashCode ile konumlandırır, çakışmalarda equals ile kesin eşitlik kontrolü yapar.",
    },
  },
  {
    id: "java-jdk-jre-jvm",
    level: "JR",
    category: "Java Core",
    prompt: "JDK, JRE ve JVM farkını prod ortam örneğiyle anlat.",
    answer:
      "JVM Java bytecode'u çalıştıran sanal makinedir. JRE, JVM ve çalışma zamanı kütüphanelerini içerir; Java uygulamasını çalıştırmak için yeterlidir. JDK ise JRE'ye ek olarak javac, jar, javadoc gibi geliştirme araçlarını içerir. Prod ortamda geliştirme yapılmayacağı için çoğu senaryoda runtime imajı veya JRE yeterlidir; build CI ya da geliştirici ortamında JDK ile yapılır.",
    keywords: ["jvm", "jre", "jdk", "bytecode", "javac", "prod"],
    tags: ["Runtime", "Build"],
    mcq: {
      options: [
        "JRE derleme, JDK sadece çalıştırma içindir.",
        "JVM kaynak kodu derler.",
        "JDK geliştirme araçlarını, JRE çalışma zamanını, JVM bytecode çalıştırmayı kapsar.",
        "Prod'da mutlaka full JDK kurulmalıdır.",
      ],
      correctIndex: 2,
      explanation:
        "JDK geliştirme ve derleme araçlarını içerir; JRE çalışma zamanı, JVM ise bytecode çalıştırma katmanıdır.",
    },
  },
  {
    id: "oop-pillars",
    level: "JR",
    category: "OOP & Patterns",
    prompt: "OOP'nin temel prensiplerini gerçek hayattan bir Java örneğiyle anlat.",
    answer:
      "Encapsulation nesnenin iç durumunu kontrollü metotlarla yönetmesidir. Inheritance ortak davranışı üst sınıfta toplar ama aşırı kullanılırsa sıkı bağımlılık doğurabilir. Polymorphism aynı interface üzerinden farklı implementasyonları çalıştırır. Abstraction gereksiz detayı saklayıp iş kabiliyetine odaklanır. Örneğin NotificationSender interface'i EmailSender ve SmsSender ile polymorphism sağlar; servis sadece sözleşmeye bağlı kalır.",
    keywords: ["encapsulation", "inheritance", "polymorphism", "abstraction", "interface"],
    tags: ["OOP"],
    mcq: {
      options: [
        "OOP sadece class dosyalarını klasörlere ayırmaktır.",
        "Encapsulation, inheritance, polymorphism ve abstraction temel prensiplerdir.",
        "Polymorphism aynı class içinde iki field tutmaktır.",
        "Abstraction sadece private field kullanımıdır.",
      ],
      correctIndex: 1,
      explanation:
        "OOP mülakatlarında dört temel prensip ve bunların pratik etkileri beklenir.",
    },
  },
  {
    id: "pattern-singleton",
    level: "JR-MID",
    category: "OOP & Patterns",
    prompt: "Singleton Pattern nedir? Spring Bean singleton'ı ile klasik Singleton aynı şey midir?",
    answer:
      "Singleton bir sınıftan tek instance olmasını amaçlayan creational pattern'dir. Klasik Java Singleton'da constructor private yapılır, instance erişimi kontrollüdür; thread-safe lazy init için enum, static holder veya synchronized/double-check yaklaşımları konuşulur. Spring'de singleton bean, application context içinde tek bean instance'ı demektir; JVM genelinde tek instance garantisiyle aynı kavram değildir.",
    keywords: ["tek instance", "private constructor", "thread safe", "enum", "spring bean", "application context"],
    tags: ["Design Pattern", "Spring"],
    mcq: {
      options: [
        "Spring singleton bean JVM genelinde her zaman tek instance garantiler.",
        "Singleton sadece database bağlantısı açmak için kullanılır.",
        "Klasik Singleton sınıf seviyesinde tek instance hedefler, Spring singleton context içindedir.",
        "Singleton thread safety konusundan bağımsızdır.",
      ],
      correctIndex: 2,
      explanation:
        "Spring singleton scope context bazlıdır; klasik pattern implementasyon detayı ve thread safety ile ayrıca değerlendirilir.",
    },
  },
  {
    id: "pattern-factory-builder",
    level: "JR-MID",
    category: "OOP & Patterns",
    prompt: "Factory ve Builder pattern ne zaman kullanılır?",
    answer:
      "Factory, nesne üretim kararını çağıran koddan ayırır; örneğin ödeme tipine göre farklı PaymentProcessor üretmek. Builder çok parametreli veya opsiyonel alanlı karmaşık nesneleri okunabilir ve kontrollü oluşturmak için kullanılır. Factory değişken implementasyon seçimini, Builder nesne kurulum karmaşıklığını yönetir.",
    keywords: ["factory", "builder", "nesne üretimi", "opsiyonel", "okunabilir"],
    tags: ["Design Pattern"],
    mcq: {
      options: [
        "Factory nesne üretim kararını soyutlar, Builder karmaşık nesne kurulumunu okunabilir yapar.",
        "Builder sadece SQL üretmek içindir.",
        "Factory her zaman Singleton ile birlikte kullanılmalıdır.",
        "İkisi de yalnızca inheritance yerine geçer.",
      ],
      correctIndex: 0,
      explanation:
        "Factory seçim/üretim kararını, Builder ise kurulum adımlarını ve opsiyonel parametreleri düzenler.",
    },
  },
  {
    id: "spring-boot-flow",
    level: "JR",
    category: "Spring Boot",
    prompt: "Bir HTTP request Spring Boot uygulamasında Controller'dan database'e kadar nasıl akar?",
    answer:
      "Client endpoint'e HTTP request gönderir. Controller request'i alır, DTO validation yapar ve işi Service katmanına devreder. Service iş kurallarını ve transaction sınırını yönetir. Repository Spring Data JPA/Hibernate üzerinden database erişimi yapar. Entity database tablosunu, DTO dış dünya kontratını temsil eder. Response uygun status code ve DTO ile döner.",
    keywords: ["controller", "dto", "service", "repository", "entity", "transaction"],
    tags: ["Spring MVC", "Layered Architecture"],
    mcq: {
      options: [
        "Controller tüm SQL'i yazmalı ve iş kuralını orada çözmelidir.",
        "Controller request'i alır, service iş kuralını yürütür, repository veri erişimini yapar.",
        "Repository HTTP status code üretir.",
        "DTO ve Entity her zaman aynı sınıf olmalıdır.",
      ],
      correctIndex: 1,
      explanation:
        "Katmanlı mimaride sorumluluklar ayrılır; controller transport, service business, repository persistence odaklıdır.",
    },
  },
  {
    id: "spring-data-jpa",
    level: "JR-MID",
    category: "Spring Boot",
    prompt: "Spring Data JPA ne sağlar? JPA, Hibernate ve ORM farkını açıkla.",
    answer:
      "ORM, relational tablo ile nesne modelini eşleyen yaklaşımdır. JPA Java tarafında persistence standardı ve anotasyon/API sözleşmesidir. Hibernate JPA'nın en yaygın implementasyonlarından biridir. Spring Data JPA repository abstraction, query method, pagination ve transaction entegrasyonu sunarak tekrar eden DAO kodunu azaltır.",
    keywords: ["orm", "jpa", "hibernate", "repository", "pagination", "query method"],
    tags: ["JPA", "Hibernate", "ORM"],
    mcq: {
      options: [
        "JPA bir standart, Hibernate implementasyon, ORM eşleme yaklaşımıdır.",
        "Hibernate sadece controller yazmak için kullanılır.",
        "Spring Data JPA SQL veritabanı gerektirmez.",
        "ORM sadece JSON serialize etmek demektir.",
      ],
      correctIndex: 0,
      explanation:
        "JPA standarttır; Hibernate implementasyon, ORM ise nesne-tablo eşleme yaklaşımıdır.",
    },
  },
  {
    id: "spring-security-auth",
    level: "JR-MID",
    category: "Security",
    prompt: "Authentication ve Authorization farkı nedir? Spring Security'de nerede karşımıza çıkar?",
    answer:
      "Authentication kullanıcının kim olduğunu doğrular; kullanıcı adı/şifre, JWT veya OAuth token doğrulama bu kapsamdadır. Authorization doğrulanan kullanıcının hangi kaynağa erişebileceğini belirler; role, authority, scope ve endpoint izinleri burada kullanılır. Spring Security filter chain request'i yakalar, Authentication nesnesini SecurityContext'e koyar ve authorization rule'ları çalıştırır.",
    keywords: ["authentication", "authorization", "securitycontext", "filter chain", "role", "scope"],
    tags: ["Spring Security", "JWT"],
    mcq: {
      options: [
        "Authentication yetki, Authorization kimlik doğrulamadır.",
        "Authentication kimlik doğrular, Authorization erişim izni kontrol eder.",
        "İkisi Spring Security'de aynı aşamadır.",
        "JWT sadece Authorization yapar, kimlikle ilgisi yoktur.",
      ],
      correctIndex: 1,
      explanation:
        "Kimlik doğrulama ve yetkilendirme farklı sorumluluklardır; güvenlik zincirinde ardışık şekilde ele alınır.",
    },
  },
  {
    id: "jwt-refresh-rotation",
    level: "MID",
    category: "Security",
    prompt: "JWT access token, refresh token ve refresh token rotation mantığını anlat.",
    answer:
      "Access token kısa ömürlüdür ve API erişiminde kullanılır. Refresh token daha uzun ömürlüdür ve yeni access token almak için kullanılır. Rotation yaklaşımında refresh token bir kez kullanıldığında expire edilir ve yerine yeni refresh token üretilir. Böylece çalınan eski token tekrar kullanılırsa reuse tespit edilebilir. Server tarafında refresh token state'i, hash'li saklama ve revoke mekanizması önemlidir.",
    keywords: ["access token", "refresh token", "rotation", "expire", "revoke", "hash"],
    tags: ["JWT", "Security"],
    mcq: {
      options: [
        "Rotation eski refresh token'ı geçersizleştirip yenisini üretir.",
        "Refresh token client'ta hiçbir zaman saklanmaz.",
        "Access token uzun ömürlü olmalıdır.",
        "JWT kullanınca server tarafında hiçbir güvenlik state'i tutulamaz.",
      ],
      correctIndex: 0,
      explanation:
        "Rotation replay riskini azaltmak için kullanılan refresh token yenileme stratejisidir.",
    },
  },
  {
    id: "keycloak-resource-server",
    level: "MID",
    category: "Security",
    prompt: "Keycloak ile Spring Boot resource server entegrasyonunu mülakatta nasıl anlatırsın?",
    answer:
      "Keycloak identity provider olarak kullanıcı, client, realm, role ve token üretimini yönetir. Spring Boot tarafı OAuth2 Resource Server olarak JWT doğrular; issuer-uri veya jwk-set-uri ile public key metadata alınır. Request bearer token ile gelir, Spring Security token imzasını ve claim'leri doğrular, role/scope bilgilerine göre endpoint authorization yapar.",
    keywords: ["keycloak", "realm", "client", "oauth2 resource server", "issuer uri", "jwk", "role"],
    tags: ["Keycloak", "OAuth2", "JWT"],
    mcq: {
      options: [
        "Keycloak sadece logging aracıdır.",
        "Resource server JWT'yi issuer/JWK metadata ile doğrular.",
        "Spring Boot her request'te Keycloak'a şifre gönderir.",
        "JWT doğrulamak için database join zorunludur.",
      ],
      correctIndex: 1,
      explanation:
        "OAuth2 Resource Server imzalı JWT'yi Keycloak metadata'sı üzerinden doğrular ve claim'lerden yetki çıkarır.",
    },
  },
  {
    id: "rest-stateless",
    level: "JR",
    category: "REST & HTTP",
    prompt: "RESTful API ve HTTP stateless kavramını endpoint örneğiyle açıkla.",
    answer:
      "RESTful API kaynakları URL ile temsil eder ve HTTP methodlarını anlamlı kullanır: GET /books listeleme, GET /books/{id} tekil okuma, POST /books oluşturma, PUT/PATCH güncelleme, DELETE silme. Stateless demek server'ın requestler arasında client session state'ine güvenmemesidir; her request kimlik, parametre ve gerekli context'i taşımalıdır.",
    keywords: ["rest", "resource", "get", "post", "stateless", "endpoint"],
    tags: ["HTTP", "REST"],
    mcq: {
      options: [
        "Stateless server'ın hiçbir veri tutmaması demektir.",
        "REST'te tüm işlemler POST ile yapılmalıdır.",
        "Her request gerekli context'i taşır; server client session state'ine bağımlı olmaz.",
        "Endpoint sadece frontend route demektir.",
      ],
      correctIndex: 2,
      explanation:
        "Stateless request bağımsızlığıdır; database veya cache kullanılmasına engel değildir.",
    },
  },
  {
    id: "third-party-api-openfeign",
    level: "JR-MID",
    category: "REST & HTTP",
    prompt: "3. parti API entegrasyonu ve OpenFeign kullanımında nelere dikkat edersin?",
    answer:
      "OpenFeign declarative HTTP client sağlar; interface üstünden endpoint tanımlanır. Dikkat edilmesi gerekenler timeout, retry, circuit breaker, error decoder, auth header, DTO kontratı, logging seviyesi ve idempotent olmayan çağrılarda tekrar riskidir. Senkron iletişim olduğu için servisler arası latency ve failure propagation yönetilmelidir.",
    keywords: ["openfeign", "timeout", "retry", "circuit breaker", "error decoder", "sync"],
    tags: ["OpenFeign", "Integration"],
    mcq: {
      options: [
        "OpenFeign Kafka consumer oluşturur.",
        "OpenFeign declarative senkron HTTP client'tır.",
        "Timeout ayarı gereksizdir.",
        "Retry her POST işleminde sınırsız yapılmalıdır.",
      ],
      correctIndex: 1,
      explanation:
        "OpenFeign servisler veya 3. parti API'ler için declarative HTTP client olarak kullanılır.",
    },
  },
  {
    id: "sql-group-having",
    level: "JR",
    category: "SQL & Database",
    prompt: "GROUP BY kullanıldığında WHERE ve HAVING farkını örnekle anlat.",
    answer:
      "WHERE satırları gruplamadan önce filtreler; HAVING gruplama ve aggregate hesaplandıktan sonra grup sonucunu filtreler. Örneğin city bazlı müşteri sayısı çıkarırken önce WHERE active = 1 ile aktif kayıtlar seçilir, GROUP BY city yapılır, HAVING COUNT(*) > 5 ile beşten fazla müşterisi olan şehirler alınır.",
    keywords: ["where", "having", "group by", "aggregate", "count", "filtre"],
    tags: ["SQL", "Oracle"],
    mcq: {
      options: [
        "WHERE aggregate sonucunu, HAVING tekil satırı filtreler.",
        "WHERE gruplama öncesi satırları, HAVING gruplama sonrası aggregate sonucu filtreler.",
        "GROUP BY varsa WHERE asla kullanılamaz.",
        "HAVING sadece Oracle'da vardır.",
      ],
      correctIndex: 1,
      explanation:
        "Aggregate koşulları HAVING ile, satır seviyesi koşullar WHERE ile ifade edilir.",
    },
  },
  {
    id: "oracle-library-schema",
    level: "JR-MID",
    category: "SQL & Database",
    prompt: "Kütüphane sistemi için temel relational tasarımda hangi tablolar ve ilişkiler olur?",
    answer:
      "Klasik tasarımda Book, Student, Staff, Loan, Return/LoanReturn ve Penalty tabloları olur. Loan book ve student ile ilişkilidir; staff ödünç verme veya iade işlemini kaydedebilir. Penalty gecikmiş iade üzerinden loan'a bağlanabilir. DDL tarafında primary key, foreign key, not null, unique ve index düşünülür; DML tarafında her tablo için örnek insert/update/delete senaryoları hazırlanır.",
    keywords: ["book", "student", "staff", "loan", "penalty", "foreign key"],
    tags: ["Database Design", "DDL", "DML"],
  },
  {
    id: "jpa-n-plus-one",
    level: "MID",
    category: "SQL & Database",
    prompt: "JPA/Hibernate N+1 problemi nedir? Nasıl fark eder ve çözersin?",
    answer:
      "N+1, ana liste için bir query atıldıktan sonra her kayıt ilişki yüklemek için ek query üretildiğinde oluşur. Loglarda beklenenden çok SQL görmek, yavaş endpoint ve profiler bunu ele verir. Çözüm olarak fetch join, EntityGraph, batch size, projection DTO veya doğru lazy/eager tasarım kullanılabilir. Her ilişkiyi eager yapmak çözüm değil, başka performans sorunları doğurabilir.",
    keywords: ["n+1", "fetch join", "entitygraph", "lazy", "eager", "projection"],
    tags: ["Hibernate", "Performance"],
    mcq: {
      options: [
        "Her ilişki EAGER yapılırsa her zaman en iyi çözümdür.",
        "N+1, liste sonrası ilişkiler için çok sayıda ek query oluşmasıdır.",
        "N+1 sadece Oracle'da görülür.",
        "N+1 compile time hatasıdır.",
      ],
      correctIndex: 1,
      explanation:
        "N+1 runtime query davranışıdır; fetch stratejisi ve query tasarımıyla yönetilir.",
    },
  },
  {
    id: "maven-gradle-build",
    level: "JR",
    category: "Tooling",
    prompt: "Build system nedir? Maven komutları üzerinden canlıya giden akışı anlat.",
    answer:
      "Build system derleme, test, paketleme ve dependency yönetimini otomatikleştirir. Maven daha standart ve XML temellidir; Gradle daha esnek DSL sunar. Tipik akışta mvn clean eski çıktıyı siler, mvn compile kaynak kodu derler, mvn test testleri çalıştırır, mvn package jar/war üretir. target klasörü build çıktısıdır ve elle düzenlenmez.",
    keywords: ["maven", "gradle", "clean", "compile", "test", "package", "target"],
    tags: ["Maven", "Gradle", "CI"],
    mcq: {
      options: [
        "Build system sadece kod formatlar.",
        "Maven clean/compile/test/package gibi lifecycle adımlarıyla build sürecini yönetir.",
        "target klasörü manuel kaynak kod alanıdır.",
        "Dependency yönetimi build system kapsamına girmez.",
      ],
      correctIndex: 1,
      explanation:
        "Build araçları derleme, test, paketleme ve dependency yönetimini standartlaştırır.",
    },
  },
  {
    id: "git-debug-logging",
    level: "JR",
    category: "Tooling",
    prompt: "Git, debugging ve logging bilgisini bir projeden örnekle nasıl anlatırsın?",
    answer:
      "Git tarafında branch, commit, merge/rebase, pull request ve conflict çözümünden bahsedebilirim. Debugging'de breakpoint, watch, stack trace, request payload ve database state kontrol edilir. Logging'de request id/correlation id, log level, hata mesajı ve exception stack trace ayrılır. Sensitive veri loglanmaz; prod'da anlamlı ama gürültüsüz log hedeflenir.",
    keywords: ["branch", "pull request", "breakpoint", "stack trace", "log level", "correlation id"],
    tags: ["Git", "Debugging", "Logging"],
  },
  {
    id: "unit-test-coverage",
    level: "JR-MID",
    category: "Testing",
    prompt: "Unit test yazsan ne kazanırsın? Coverage oranını nasıl yorumlarsın?",
    answer:
      "Unit test iş kuralını hızlı ve izole doğrular, refactor güveni verir ve regression riskini azaltır. Interface ve dependency injection mock kullanımını kolaylaştırır. Coverage sadece satır çalıştı göstergesidir; yüzde yüksek olsa bile assertion zayıfsa kalite düşüktür. Kritik business logic, edge case ve hata akışları öncelikli testlenir.",
    keywords: ["unit test", "mock", "dependency injection", "coverage", "regression", "edge case"],
    tags: ["JUnit", "Mockito", "Quality"],
    mcq: {
      options: [
        "Coverage yüzde 100 ise test kalitesi kesin mükemmeldir.",
        "Unit test refactor güveni ve regression koruması sağlar.",
        "Mock kullanımı sadece controller testlerinde olur.",
        "Unit test database migration yerine geçer.",
      ],
      correctIndex: 1,
      explanation:
        "Coverage tek başına yeterli değildir; doğru assertion ve kritik senaryolar önemlidir.",
    },
  },
  {
    id: "pipeline-behaviors",
    level: "MID",
    category: "Architecture",
    prompt: "Logging Behavior, Performance Monitoring ve Transaction Behavior gibi pipeline component'larını nasıl sıralarsın?",
    answer:
      "Pipeline davranışları cross-cutting concern'leri merkezi yönetir. Genel sıra dıştan içe logging/correlation, performance ölçümü, validation/authorization ve transaction şeklinde tasarlanabilir; transaction genellikle handler'a yakın olmalıdır ki sadece iş kuralı ve persistence kısmını kapsasın. Logging request/response bilgisini, performance 3000ms üstü requestleri yakalayabilir. Order açıkça belirlenir ve her behavior component olarak işaretlenir.",
    keywords: ["pipeline", "logging", "performance", "transaction", "order", "cross cutting"],
    tags: ["Pipeline", "Architecture"],
    mcq: {
      options: [
        "Transaction behavior en dışta olmalı ve tüm logging süresini kapsamalı.",
        "Sıra önemsizdir; framework rastgele çalıştırır.",
        "Cross-cutting behavior'lar order ile tanımlanır; transaction iş kuralına yakın tutulur.",
        "Performance monitoring sadece frontend konusudur.",
      ],
      correctIndex: 2,
      explanation:
        "Pipeline behavior sırası davranışın kapsamını değiştirir; bu yüzden explicit order gerekir.",
    },
  },
  {
    id: "kafka-basics",
    level: "JR-MID",
    category: "Microservices",
    prompt: "Kafka, topic, producer, consumer ve event-driven architecture kavramlarını anlat.",
    answer:
      "Kafka event tabanlı haberleşme için kullanılan message broker/event streaming platformudur. Topic eventlerin yayınlandığı kanaldır. Producer eventi üretir ve topic'e yazar. Consumer topic'i dinleyip eventi işler. Event-driven architecture'da servisler direkt birbirini çağırmak yerine olaylar üzerinden gevşek bağlı haberleşir; bu ölçeklenebilirlik sağlar ama eventual consistency ve idempotency gerektirir.",
    keywords: ["kafka", "topic", "producer", "consumer", "event driven", "eventual consistency", "idempotency"],
    tags: ["Kafka", "EDA"],
    mcq: {
      options: [
        "Producer topic'i dinler, consumer topic'e yazar.",
        "Topic eventlerin yayınlandığı kanaldır; producer yazar, consumer dinler.",
        "Kafka sadece REST gateway'dir.",
        "Event-driven mimaride tutarlılık konusu ortadan kalkar.",
      ],
      correctIndex: 1,
      explanation:
        "Kafka'da producer event üretir, topic'e yazar; consumer topic'ten okuyup işler.",
    },
  },
  {
    id: "outbox-debezium",
    level: "MID",
    category: "Microservices",
    prompt: "Transactional Outbox Pattern, polling ve Debezium CDC farkını order-service/product-service örneğiyle anlat.",
    answer:
      "Order-service sipariş transaction'ı içinde order kaydıyla birlikte outbox_messages tablosuna OrderCreatedEvent yazar. Böylece database değişikliği ve event kaydı atomik olur. Basit çözümde bir polling mekanizması retryCount ile gönderilmemiş kayıtları okur, Kafka'ya yollar ve status günceller. Daha profesyonel çözümde Debezium CDC database loglarını izleyip outbox değişimini Kafka'ya taşır. Product-service eventi tüketir, stok düşer; idempotency ile aynı event tekrar gelirse çift işlem engellenir.",
    keywords: ["transactional outbox", "ordercreatedevent", "retrycount", "polling", "debezium", "cdc", "idempotency"],
    tags: ["Outbox", "Debezium", "Kafka"],
    mcq: {
      options: [
        "Outbox event'i transaction dışı memory'de tutar.",
        "Debezium CDC database değişiklik loglarını izleyerek event aktarabilir.",
        "retryCount sadece frontend state'idir.",
        "Idempotency duplicate eventleri özellikle artırmak içindir.",
      ],
      correctIndex: 1,
      explanation:
        "Debezium CDC değişiklik yakalama yaklaşımıdır; outbox ile birlikte güvenilir event yayını sağlar.",
    },
    followUps: [
      "Outbox kaydı Kafka'ya gitti ama status güncellenemedi; ne olur?",
      "Product-service duplicate OrderCreatedEvent alırsa nasıl davranmalı?",
    ],
  },
  {
    id: "idempotency",
    level: "MID",
    category: "Microservices",
    prompt: "Idempotency nedir? Sipariş ve stok akışında neden kritik hale gelir?",
    answer:
      "Idempotency aynı işlemin birden fazla kez çağrılsa bile sonucu değiştirmemesidir. Event-driven sistemlerde retry, network timeout veya consumer restart nedeniyle aynı event birden fazla işlenebilir. Product-service eventId veya idempotency key'i processed_event tablosunda saklayarak aynı OrderCreatedEvent'i ikinci kez işlerse stok tekrar düşmez. HTTP tarafında da POST gibi non-idempotent işlemler için idempotency key kullanılabilir.",
    keywords: ["idempotency", "duplicate", "retry", "eventid", "processed event", "stok"],
    tags: ["Reliability", "Kafka"],
    mcq: {
      options: [
        "Aynı isteğin tekrarında sonuç değişmiyorsa idempotent davranıştan söz edilir.",
        "Idempotency sadece GET endpointleri için vardır.",
        "Retry varsa idempotency gereksizdir.",
        "Event id saklamak duplicate riskini artırır.",
      ],
      correctIndex: 0,
      explanation:
        "Tekrar eden çağrıların çift etki üretmemesi dağıtık sistemlerde temel güvenilirlik beklentisidir.",
    },
  },
  {
    id: "gateway-bff-config-redis",
    level: "MID",
    category: "Microservices",
    prompt: "Spring Cloud Gateway, BFF, Config Server ve Redis'i hangi problem için kullanırsın?",
    answer:
      "Spring Cloud Gateway dış dünyadan gelen requestleri microservice'lere route eder; rate limit, auth filter ve path rewrite gibi edge concern'leri yönetebilir. BFF belirli frontend deneyimi için backend response'larını şekillendirir. Config Server merkezi konfigürasyon sağlar. Redis cache, distributed lock, rate limit counter veya token/session destek senaryolarında kullanılabilir; cache invalidation stratejisi net olmalıdır.",
    keywords: ["gateway", "bff", "config server", "redis", "route", "cache", "rate limit"],
    tags: ["Spring Cloud", "Redis"],
    mcq: {
      options: [
        "Gateway database migration yapar.",
        "BFF tüm servislerin yerini alan monolith'tir.",
        "Gateway route ve edge concern'leri, Config Server merkezi config'i, Redis cache/counter gibi işleri yönetebilir.",
        "Redis sadece relational join içindir.",
      ],
      correctIndex: 2,
      explanation:
        "Bu araçlar routing, frontend odaklı API, merkezi config ve hızlı veri erişimi problemlerini çözer.",
    },
  },
  {
    id: "load-balancing-round-robin",
    level: "JR-MID",
    category: "Microservices",
    prompt: "Round Robin Load Balancing nedir? En müsait instance'a göndermekle aynı şey mi?",
    answer:
      "Round Robin gelen istekleri instance listesinde sırayla dağıtır; her seferinde bir sonraki instance seçilir. En müsait veya en düşük latency'li instance'ı seçmek değildir. Basit ve öngörülebilirdir fakat instance kapasiteleri farklıysa weighted round robin veya health/latency bazlı stratejiler daha uygun olabilir.",
    keywords: ["round robin", "load balancing", "sırayla", "instance", "weighted"],
    tags: ["Load Balancing"],
    mcq: {
      options: [
        "Round Robin her zaman en boş sunucuyu seçer.",
        "Round Robin instance'lara sırayla gönderir.",
        "Round Robin sadece database transaction için kullanılır.",
        "Round Robin duplicate event çözümüdür.",
      ],
      correctIndex: 1,
      explanation:
        "Round Robin basit sıra tabanlı dağıtım stratejisidir; anlık uygunluk ölçmez.",
    },
  },
  {
    id: "docker-agile",
    level: "JR",
    category: "DevOps & Team",
    prompt: "Docker ve Agile/Scrum tecrübeni junior seviyede nasıl anlatırsın?",
    answer:
      "Docker uygulama ve bağımlılıklarını container image içinde paketleyerek ortam farklarını azaltır. Dockerfile image build tarifidir; docker-compose localde birden çok servisi birlikte ayağa kaldırmak için kullanılabilir. Scrum tarafında sprint, daily, backlog, refinement, review ve retrospective kavramlarını; task takibi, PR review ve ekip içi iletişimle birlikte anlatırım.",
    keywords: ["docker", "image", "container", "dockerfile", "compose", "scrum", "sprint"],
    tags: ["Docker", "Agile"],
    mcq: {
      options: [
        "Docker sadece Java kodu compile eder.",
        "Container uygulama ve bağımlılıklarını taşınabilir hale getirir.",
        "Scrum'da backlog kavramı yoktur.",
        "Dockerfile canlı logları saklayan dosyadır.",
      ],
      correctIndex: 1,
      explanation:
        "Docker ortam tutarlılığı ve paketleme için; Scrum ise iteratif ekip çalışması için konuşulur.",
    },
  },
  {
    id: "ai-tools-agent",
    level: "JR-MID",
    category: "AI & Prompting",
    prompt: "Mülakatta AI tool'ları ve agent kullanımını sorarlarsa nasıl teknik cevap verirsin?",
    answer:
      "AI araçlarını kod üretiminden çok hızlandırıcı ve ikinci göz olarak konumlandırırım. Boilerplate üretme, test senaryosu çıkarma, log analiz etme, dokümantasyon taslağı, refactor önerisi ve prompt ile teknik konu çalışma gibi alanlarda kullanırım. Agent'a hedef, bağlam, kısıt ve doğrulama adımı veririm; çıkan kodu review eder, test çalıştırır ve domain kararını ben veririm. Claude, OpenAI veya Gemini gibi modelleri denediğimi, promptlarımı CRAFT gibi yapılandırdığımı söyleyebilirim.",
    keywords: ["ai tools", "agent", "prompt", "review", "test", "domain", "craft"],
    tags: ["AI", "Behavioral"],
    mcq: {
      options: [
        "AI çıktısını test etmeden direkt production'a almak doğru yaklaşımdır.",
        "Agent'a bağlam, hedef, kısıt ve doğrulama adımı verip çıktıyı review etmek gerekir.",
        "AI sadece görsel üretmek için kullanılır.",
        "Prompt yazımında rol ve bağlam vermek gereksizdir.",
      ],
      correctIndex: 1,
      explanation:
        "Mülakatta beklenen cevap AI'yı bilinçli, doğrulamalı ve domain hakimiyetini kaybetmeden kullanmaktır.",
    },
  },
  {
    id: "craft-prompt",
    level: "JR",
    category: "AI & Prompting",
    prompt: "CRAFT prompt yapısını Java/Spring öğrenme örneğiyle anlat.",
    answer:
      "CRAFT; Context, Role, Action, Format, Tone başlıklarıyla isteği netleştirmeye yarar. Context'te Spring Boot kursunda olduğumu ve JWT konusunun oturmadığını söylerim. Role'de deneyimli Java/Spring eğitmeni isterim. Action'da var olan projeye JWT auth sistemi kurmasını ve nedenlerini açıklamasını belirtirim. Format'ta önce kavram, sonra adım adım implementasyon ve sık hatalar isterim. Tone'da junior geliştiriciye uygun teknik ama anlaşılır ton belirtirim.",
    keywords: ["context", "role", "action", "format", "tone", "jwt", "spring"],
    tags: ["Prompt Engineering"],
  },
  {
    id: "project-intro",
    level: "JR",
    category: "Behavioral",
    prompt: "Bana projelerini anlat derlerse 90 saniyelik güçlü cevabın nasıl olmalı?",
    answer:
      "Cevap problem, sorumluluk, teknoloji ve sonuç sırasıyla gitmeli. Örneğin: Son projemde sipariş ve stok akışını yöneten Spring Boot tabanlı bir backend üzerinde çalıştım. Controller-Service-Repository katmanında REST endpointler, JPA entity/repository, validation ve exception handling yazdım. Güvenlik tarafında JWT/OAuth2 Resource Server mantığını çalıştım. Microservice dönüşümünde order-service event üretir, product-service Kafka üzerinden stok günceller; duplicate event için idempotency ve outbox desenini ele aldım. Test, logging ve debugging ile hataları izole ettim.",
    keywords: ["problem", "sorumluluk", "teknoloji", "sonuç", "spring boot", "test"],
    tags: ["Behavioral", "Project"],
  },
  {
    id: "why-java",
    level: "JR",
    category: "Behavioral",
    prompt: "Neden Java backend alanı? Çözüm odaklı ve gelişime açık olduğunu nasıl gösterirsin?",
    answer:
      "Java backend'i güçlü ekosistem, kurumsal kullanım, Spring Boot verimliliği ve ölçeklenebilir servis mimarileri nedeniyle seçtiğimi söylerim. Gelişime açıklığı sadece öğreniyorum diye değil, düzenli pratik, proje notu tutma, eksik konuyu küçük örnekle kapatma, PR feedback'i alma ve test/debug süreçlerini uygulama üzerinden anlatırım. Çözüm odaklılıkta problemi parçalara ayırma, log ve veriyle doğrulama, ekipten zamanında destek isteme önemli.",
    keywords: ["java", "spring boot", "ekosistem", "öğrenme", "feedback", "problem çözme"],
    tags: ["Behavioral"],
  },
  {
    id: "manual-automation-analyst",
    level: "JR-MID",
    category: "Team & Delivery",
    prompt: "Sadece kodlama değil; devops, test uzmanlığı ve analiz tarafıyla nasıl çalışırsın?",
    answer:
      "Backend geliştirici olarak analistten gereksinim ve acceptance criteria netliği isterim, test uzmanıyla edge case ve UAT senaryolarını konuşurum, DevOps tarafıyla environment, pipeline, log ve deployment konularında koordineli olurum. Otomasyon testlerinin hangi akışı koruduğunu, manual UAT'nin kullanıcı beklentisini doğruladığını bilirim. İyi teslimat sadece kod yazmak değil, anlaşılır kontrat, test edilebilirlik ve izlenebilirlik sağlamaktır.",
    keywords: ["devops", "test", "uat", "analiz", "acceptance criteria", "pipeline"],
    tags: ["Team", "Delivery"],
  },
];
