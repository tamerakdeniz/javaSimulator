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
- CRM proje stack'i: Java 21, Spring Boot 4.0.6, Spring Cloud 2025.1.1, Gateway, Springdoc OpenAPI, React 19, TypeScript 6, Vite 8, PostgreSQL 16, Flyway, Kafka, Debezium Kafka Connect, Redis 7, Keycloak JWT, Resilience4j, Actuator, Micrometer, Prometheus, Grafana, OpenTelemetry, Zipkin, Testcontainers, SonarCloud, Docker Compose, Kubernetes/Kustomize, GitHub Actions ve GHCR.
- SEM staj anlatimi: Surekli Egitim Merkezi domain'i, Java unit testleri, JUnit 5, Mockito, Spring Boot Test/MockMvc kullanilmis olabilecek test katmanlari, coverage ve test kalitesi. Kesin kullanilmayan teknoloji kullanildi diye anlatilmaz.
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
      "Cevap problem, sorumluluk, teknoloji ve sonuç sırasıyla gitmeli. Örneğin: CRM projemizde müşteri, etkileşim ve operasyonel kayıtların yönetildiği Java 21 ve Spring Boot tabanlı bir sistem üzerinde çalıştık. Backend tarafında REST endpoint, service/repository katmanı, JPA entity, validation, exception handling ve Flyway migration akışlarını anlatabilirim. Microservice tarafında Gateway, Keycloak JWT doğrulama, Kafka event akışı, transactional outbox, Debezium CDC, Redis cache/idempotency ve Resilience4j ile kontrollü upstream çağrılarını çalıştık. Gözlemlenebilirlikte Actuator, Micrometer, Prometheus/Grafana ve trace tarafında OpenTelemetry/Zipkin; kalite tarafında JUnit 5, Mockito, Testcontainers, JaCoCo ve SonarCloud vardı. Sonuç olarak sadece kod yazmadım; test, log, deployment ve ekip içi teslimat akışını da gördüm.",
    keywords: ["crm", "sorumluluk", "teknoloji", "spring boot", "gateway", "kafka", "test"],
    tags: ["Behavioral", "Project", "CRM"],
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
  {
    id: "crm-architecture-overview",
    level: "MID",
    category: "Project CRM",
    prompt: "CRM projesinin mimarisini Java 21, Spring Boot, Gateway, Kafka, Redis ve Keycloak stack'iyle nasıl anlatırsın?",
    answer:
      "CRM projesini müşteri ve operasyonel süreçleri yöneten çok katmanlı bir sistem olarak anlatırım. Frontend React/TypeScript/Vite ile kullanıcı arayüzünü sunar. Dış istekler Spring Cloud Gateway üzerinden geçer; burada routing, auth filter, rate limit ve header relay gibi edge concern'ler yönetilir. Backend servisler Java 21 ve Spring Boot ile REST endpoint, service, repository ve transaction katmanlarına ayrılır. PostgreSQL kalıcı veri kaynağıdır, Flyway schema migration'ı versiyonlar, JPA/Hibernate entity persistence sağlar. Kafka event tabanlı iletişim için, transactional outbox ve Debezium Kafka Connect güvenilir event yayını için kullanılır. Redis cache, idempotency key ve rate limit counter gibi hızlı state ihtiyaçlarında devreye girer. Keycloak JWT üretir, servisler OAuth2 Resource Server olarak token doğrular. Observability ve CI/CD katmanını da kısaca eklerim.",
    keywords: ["crm", "gateway", "spring boot", "postgresql", "kafka", "redis", "keycloak", "observability"],
    tags: ["CRM", "Architecture", "Microservices"],
    mcq: {
      options: [
        "Gateway sadece React componentlerini render eder.",
        "Kafka ve outbox servisler arası güvenilir event akışında kullanılır.",
        "Flyway runtime cache tutmak için kullanılır.",
        "Keycloak database migration aracıdır.",
      ],
      correctIndex: 1,
      explanation:
        "Kafka event iletişimini, outbox ise database transaction'ı ile event kaydını güvenilir bağlamayı sağlar.",
    },
    followUps: [
      "Bu mimaride request path'i frontend'den database'e kadar nasıl akar?",
      "Bu kadar çok teknolojiyi ezber gibi değil problem üzerinden nasıl anlatırsın?",
    ],
  },
  {
    id: "java21-spring-boot4",
    level: "JR-MID",
    category: "Spring Boot",
    prompt: "Java 21 ve Spring Boot 4.0.6 kullanılan bir backend projesinde junior geliştirici olarak nelere hakim olmalısın?",
    answer:
      "Önce Java 21 tarafında record, switch expression, var, stream, optional, collection kullanımı ve exception yönetimi gibi günlük geliştirme konularını bilirim. Spring Boot tarafında auto-configuration, dependency injection, bean lifecycle, configuration properties, profile, validation, exception handling, controller-service-repository ayrımı ve transaction yönetimini anlatırım. Projede versiyon bilmek tek başına yeterli değildir; endpoint yazma, DTO/entity ayrımı, repository query, log okuma, unit test ve hata ayıklama pratiği beklenir.",
    keywords: ["java 21", "spring boot", "dependency injection", "bean", "profile", "transaction", "dto"],
    tags: ["Java 21", "Spring Boot", "Backend"],
    mcq: {
      options: [
        "Sadece versiyon numarasını bilmek teknik hakimiyet için yeterlidir.",
        "Spring Boot'ta DI, configuration, controller-service-repository ve transaction akışı bilinmelidir.",
        "Java 21 kullanınca unit test gerekmez.",
        "DTO ve entity her zaman aynı obje olmalıdır.",
      ],
      correctIndex: 1,
      explanation:
        "Mülakatta versiyondan çok bu versiyonla proje içinde hangi sorumlulukları aldığın ve temel Spring akışını bilmen beklenir.",
    },
  },
  {
    id: "spring-web-webflux-gateway",
    level: "MID",
    category: "REST & HTTP",
    prompt: "Spring Web, WebFlux ve Spring Cloud Gateway farklarını CRM projesi üzerinden anlat.",
    answer:
      "Spring Web klasik servlet tabanlı blocking MVC stack'tir; çoğu CRUD endpoint için anlaşılır ve yeterlidir. WebFlux reactive/non-blocking programlama modelidir; yoğun IO ve streaming gibi senaryolarda anlamlı olabilir ama complexity getirir. Spring Cloud Gateway ise business endpoint yazdığımız yer değil, dış istekleri servislere yönlendiren edge katmanıdır. Gateway'de route, predicate, filter, auth propagation, rate limit, timeout ve header relay gibi konular konuşulur. Mülakatta her şeyi WebFlux yapmanın otomatik performans kazancı olmadığını, kullanım sebebinin problemle açıklanması gerektiğini söylemek iyi olur.",
    keywords: ["spring web", "webflux", "gateway", "blocking", "reactive", "route", "filter"],
    tags: ["Spring Web", "WebFlux", "Gateway"],
    mcq: {
      options: [
        "Gateway service katmanındaki business logic'i yazmak için kullanılır.",
        "WebFlux her projede Spring Web'den kesin daha hızlıdır.",
        "Spring Web blocking MVC, WebFlux reactive stack, Gateway edge routing katmanıdır.",
        "Gateway kullanınca servislerde security gerekmez.",
      ],
      correctIndex: 2,
      explanation:
        "Bu üçü farklı katman ve programlama modellerine karşılık gelir; doğru seçim problemin türüne bağlıdır.",
    },
  },
  {
    id: "springdoc-openapi-contract",
    level: "JR-MID",
    category: "REST & HTTP",
    prompt: "Springdoc OpenAPI CRM projesinde ne sağlar? Swagger ekranı dışında neden önemlidir?",
    answer:
      "Springdoc OpenAPI REST endpointlerin request/response kontratını OpenAPI formatında dokümante eder. Sadece Swagger UI açmak değildir; frontend-backend anlaşması, QA test hazırlığı, client generation, endpoint keşfi ve breaking change farkındalığı sağlar. DTO isimleri, validation anotasyonları, status code'lar, error response yapısı ve security scheme doğru tanımlanırsa ekip içi iletişimi güçlendirir.",
    keywords: ["springdoc", "openapi", "swagger", "contract", "dto", "status code", "client"],
    tags: ["OpenAPI", "Documentation", "REST"],
    mcq: {
      options: [
        "OpenAPI sadece veritabanı migration dosyası üretir.",
        "OpenAPI endpoint kontratını ekipler arasında görünür ve test edilebilir hale getirir.",
        "Swagger UI varsa validation gerekmez.",
        "Springdoc Kafka topiclerini otomatik consume eder.",
      ],
      correctIndex: 1,
      explanation:
        "OpenAPI dokümantasyonu API kontratının anlaşılması ve doğrulanması için kullanılır.",
    },
  },
  {
    id: "frontend-react-vite-typescript",
    level: "JR-MID",
    category: "Frontend",
    prompt: "React 19, TypeScript 6, Vite 8 ve Lucide React kullanılan frontend'i backend mülakatında nasıl anlatırsın?",
    answer:
      "Backend adayından frontend uzmanı gibi derinlik beklenmeyebilir ama entegrasyon farkındalığı beklenir. React component tabanlı UI geliştirmek için, TypeScript tip güvenliği ve API DTO'larını daha kontrollü kullanmak için, Vite hızlı geliştirme server'ı ve build süreci için, Lucide React ise tutarlı icon seti için kullanılır. Backend ile contract tarafında OpenAPI, DTO alanları, auth token taşıma, error handling, pagination/filter parametreleri ve CORS/gateway route'ları konuşulabilir.",
    keywords: ["react", "typescript", "vite", "lucide", "dto", "openapi", "auth"],
    tags: ["React", "TypeScript", "Frontend Integration"],
    mcq: {
      options: [
        "Lucide React backend transaction yönetir.",
        "Vite database migration aracıdır.",
        "Backend açısından frontend bilgisi API kontratı, auth, error ve state akışını anlamaya yarar.",
        "TypeScript kullanınca runtime validation otomatik çözülür.",
      ],
      correctIndex: 2,
      explanation:
        "Backend mülakatında frontend stack'i en çok API kontratı ve entegrasyon sorumluluğu üzerinden anlatmak faydalıdır.",
    },
  },
  {
    id: "postgres-flyway-jpa-crm",
    level: "MID",
    category: "SQL & Database",
    prompt: "PostgreSQL 16, Flyway, Spring Data JPA ve Hibernate CRM projesinde hangi sorumlulukları karşılar?",
    answer:
      "PostgreSQL relational veri kaynağıdır; CRM'de customer, contact, activity, note, task gibi tabloları tutabilir. Flyway schema değişikliklerini versiyonlu migration dosyalarıyla yönetir; ekipte herkes aynı database yapısına gelir. JPA Java persistence standardıdır, Hibernate bunun implementasyonudur. Spring Data JPA repository abstraction, query method, pagination ve transaction entegrasyonu sağlar. Junior seviyede entity ilişki tasarımı, index ihtiyacı, migration sırası, nullable/unique constraint, N+1 ve transaction boundary konularını bilmek önemlidir.",
    keywords: ["postgresql", "flyway", "jpa", "hibernate", "migration", "repository", "index", "transaction"],
    tags: ["PostgreSQL", "Flyway", "JPA"],
    mcq: {
      options: [
        "Flyway cache invalidation yapar.",
        "Hibernate OpenAPI dokümanı üretir.",
        "Flyway migration'ları versiyonlar, JPA/Hibernate nesne-tablo eşlemesini yönetir.",
        "PostgreSQL kullanınca transaction gerekmez.",
      ],
      correctIndex: 2,
      explanation:
        "Veri katmanında PostgreSQL storage, Flyway schema versioning, JPA/Hibernate persistence eşlemesi sağlar.",
    },
  },
  {
    id: "debezium-kafka-connect-outbox",
    level: "MID",
    category: "Microservices",
    prompt: "Debezium Kafka Connect ve transactional outbox CRM projesinde birlikte nasıl çalışır?",
    answer:
      "Servis business transaction içinde hem ana kaydı hem de outbox tablosuna event kaydını yazar. Örneğin CustomerUpdatedEvent veya LeadAssignedEvent outbox'a düşer. Debezium Kafka Connect PostgreSQL değişiklik loglarını takip eder, outbox tablosundaki yeni kayıtları Kafka topic'lerine taşır. Böylece uygulama kodu event'i doğrudan Kafka'ya yazarken database commit başarısızlığı gibi atomicity sorunlarına daha az düşer. Consumer tarafında duplicate event ihtimali için idempotency yine gerekir.",
    keywords: ["debezium", "kafka connect", "outbox", "cdc", "event", "atomicity", "idempotency"],
    tags: ["Debezium", "Kafka Connect", "Outbox"],
    mcq: {
      options: [
        "Debezium React componentlerini Kafka'ya taşır.",
        "Outbox business transaction ile event kaydını aynı database commit'i içinde tutar.",
        "Kafka Connect sadece CSS build eder.",
        "CDC kullanınca duplicate event ihtimali tamamen yok olur.",
      ],
      correctIndex: 1,
      explanation:
        "Transactional outbox atomicity problemini azaltır; Debezium/Kafka Connect outbox değişikliklerini Kafka'ya aktarabilir.",
    },
  },
  {
    id: "redis-cache-idempotency-crm",
    level: "MID",
    category: "Microservices",
    prompt: "Redis 7 CRM projesinde cache ve idempotency için nasıl kullanılır?",
    answer:
      "Redis düşük latency'li key-value store olarak sık okunan referans verilerini, rate limit counter'larını veya kısa ömürlü idempotency key'leri tutabilir. CRM'de örneğin aynı lead import isteğinin tekrar işlenmesini önlemek için idempotency key saklanabilir. Cache kullanımında TTL, invalidation, stale data, key naming ve fallback stratejisi konuşulmalıdır. Redis'e her şeyi koymak doğru değildir; kalıcı ve ilişkisel veri PostgreSQL'de kalır.",
    keywords: ["redis", "cache", "idempotency key", "ttl", "rate limit", "invalidation", "stale"],
    tags: ["Redis", "Cache", "Idempotency"],
    mcq: {
      options: [
        "Redis relational foreign key constraint için kullanılır.",
        "Redis cache, kısa ömürlü state, idempotency key ve counter senaryolarında kullanılabilir.",
        "Cache kullanınca database'e hiç ihtiyaç kalmaz.",
        "TTL cache tasarımında önemsizdir.",
      ],
      correctIndex: 1,
      explanation:
        "Redis hızlı erişim ve kısa ömürlü state için uygundur; cache invalidation ve TTL tasarımın parçasıdır.",
    },
  },
  {
    id: "keycloak-gateway-header-relay",
    level: "MID",
    category: "Security",
    prompt: "Keycloak JWT, OAuth2 Resource Server ve gateway header relay akışını anlat.",
    answer:
      "Kullanıcı veya frontend Keycloak üzerinden token alır. İstek Gateway'e Bearer JWT ile gelir. Gateway token doğrulama, route authorization veya bazı header enrich/relay işlemleri yapabilir; ardından request'i ilgili servise yönlendirir. Backend servisler de OAuth2 Resource Server olarak JWT imzasını, issuer bilgisini ve claim/scope/role değerlerini doğrulamalıdır. Header relay, kullanıcı veya correlation bilgisinin downstream servislere taşınmasıdır; güvenilmeyen header'lar direkt kabul edilmemeli, gateway kontrolünde normalize edilmelidir.",
    keywords: ["keycloak", "jwt", "oauth2 resource server", "gateway", "header relay", "issuer", "scope", "role"],
    tags: ["Keycloak", "Gateway", "Security"],
    mcq: {
      options: [
        "Gateway token gördüyse downstream servisler hiçbir kontrol yapmamalıdır.",
        "Resource Server JWT issuer/imza/claim doğrulaması yapar.",
        "Header relay kullanıcı şifresini tüm servislere göndermek demektir.",
        "Keycloak sadece frontend icon kütüphanesidir.",
      ],
      correctIndex: 1,
      explanation:
        "Resource Server imzalı token doğrular; gateway header relay ise güvenli şekilde gerekli context'i servislere taşıyabilir.",
    },
  },
  {
    id: "resilience4j-upstream-calls",
    level: "MID",
    category: "Resilience",
    prompt: "Resilience4j, rate limit, timeout ve kontrollü upstream çağrıları neden gerekir?",
    answer:
      "Microservice veya 3. parti API çağrılarında gecikme ve hata kaçınılmazdır. Timeout, sonsuz beklemeyi engeller. Retry geçici hatalarda işe yarar ama idempotent olmayan işlemlerde dikkatli kullanılmalıdır. Circuit breaker sürekli başarısız upstream'i kısa süreli devreden çıkarıp sistemi korur. Rate limiter belirli süre içinde çağrı sayısını sınırlar. CRM'de örneğin dış servisden müşteri skor bilgisi çekiyorsak fallback, log, metric ve kullanıcıya kontrollü hata mesajı tasarlanmalıdır.",
    keywords: ["resilience4j", "timeout", "retry", "circuit breaker", "rate limiter", "fallback", "upstream"],
    tags: ["Resilience4j", "Reliability"],
    mcq: {
      options: [
        "Timeout kullanmak yerine thread'i sonsuza kadar bekletmek daha güvenlidir.",
        "Retry her POST çağrısında sınırsız yapılmalıdır.",
        "Circuit breaker, timeout, rate limit ve fallback failure propagation'ı kontrol eder.",
        "Resilience sadece CSS bundle boyutunu azaltır.",
      ],
      correctIndex: 2,
      explanation:
        "Resilience pattern'leri bağımlı servis hatalarının tüm sistemi çökertmesini önlemek için kullanılır.",
    },
  },
  {
    id: "observability-actuator-micrometer-otel",
    level: "MID",
    category: "Observability",
    prompt: "Actuator, Micrometer, Prometheus, Grafana, OpenTelemetry ve Zipkin farklarını proje üzerinden anlat.",
    answer:
      "Actuator uygulamanın health, metrics ve info gibi operational endpointlerini açar. Micrometer JVM ve application metriclerini ortak formatta toplama abstraction'ı sağlar. Prometheus bu metricleri scrape eder ve saklar. Grafana metric dashboard ve alarm görünümü sunar. OpenTelemetry trace, metric ve log sinyalleri için vendor-neutral instrumentation yaklaşımıdır. Zipkin distributed trace'leri görselleştirerek bir request'in Gateway'den backend servislere ve database/external call akışına kadar nerede geciktiğini anlamaya yardım eder.",
    keywords: ["actuator", "micrometer", "prometheus", "grafana", "opentelemetry", "zipkin", "trace", "metrics"],
    tags: ["Observability", "Metrics", "Tracing"],
    mcq: {
      options: [
        "Grafana uygulama içinde repository implementasyonu sağlar.",
        "Prometheus metric toplar, Grafana görselleştirir, Zipkin trace görünümü sağlar.",
        "Actuator sadece React build aracıdır.",
        "Tracing sadece unit test coverage yüzdesidir.",
      ],
      correctIndex: 1,
      explanation:
        "Observability araçları health, metric ve trace sinyallerini üretme, toplama ve görselleştirme rollerine ayrılır.",
    },
  },
  {
    id: "testing-stack-crm",
    level: "JR-MID",
    category: "Testing",
    prompt: "JUnit 5, Mockito, Testcontainers, JaCoCo ve SonarCloud CRM projesinde nasıl konumlanır?",
    answer:
      "JUnit 5 test framework'üdür; test lifecycle, assertion ve parameterized test gibi imkanlar sağlar. Mockito bağımlılıkları mock'layarak service unit testlerini izole etmeye yarar. Testcontainers PostgreSQL, Kafka veya Redis gibi gerçek bağımlılıkları container ile ayağa kaldırıp integration test yazmayı sağlar. JaCoCo coverage raporu üretir ama tek başına kalite garantisi değildir. SonarCloud static analysis, code smell, bug, vulnerability ve coverage görünürlüğü sağlar. Mülakatta hangi katmanda hangi test yazdığını örnekle anlatmak gerekir.",
    keywords: ["junit 5", "mockito", "testcontainers", "jacoco", "sonarcloud", "unit test", "integration test"],
    tags: ["JUnit", "Mockito", "Testcontainers", "Quality"],
    mcq: {
      options: [
        "Mockito gerçek PostgreSQL container'ı başlatır.",
        "Testcontainers gerçek bağımlılıklarla integration test yazmaya yardım eder.",
        "JaCoCo production log toplar.",
        "SonarCloud sadece UI icon setidir.",
      ],
      correctIndex: 1,
      explanation:
        "Testcontainers dış bağımlılıkları container olarak çalıştırıp daha gerçekçi integration test ortamı sağlar.",
    },
  },
  {
    id: "devops-github-actions-ghcr-kustomize",
    level: "MID",
    category: "DevOps & Team",
    prompt: "Docker Compose, Kubernetes/Kustomize, GitHub Actions ve GHCR image publish akışını anlat.",
    answer:
      "Docker Compose local geliştirmede backend, database, Redis, Kafka gibi servisleri birlikte ayağa kaldırmak için kullanılır. CI tarafında GitHub Actions checkout, build, test, static analysis, image build ve publish adımlarını çalıştırabilir. GHCR GitHub Container Registry'dir; build edilen container image burada saklanır. Kubernetes deployment ortamıdır; Kustomize environment bazlı manifest patch'leriyle dev/stage/prod konfigürasyon farklarını yönetebilir. Junior seviyede en azından local compose, CI test adımı, image tag ve deployment manifest mantığını anlatmak beklenir.",
    keywords: ["docker compose", "kubernetes", "kustomize", "github actions", "ghcr", "image", "ci"],
    tags: ["Docker", "Kubernetes", "CI/CD"],
    mcq: {
      options: [
        "GHCR SQL migration aracıdır.",
        "Kustomize React state yönetir.",
        "GitHub Actions CI adımlarını, GHCR image registry'yi, Kustomize Kubernetes manifest farklarını yönetir.",
        "Docker Compose sadece production Kubernetes cluster'ıdır.",
      ],
      correctIndex: 2,
      explanation:
        "DevOps akışında local compose, CI pipeline, image registry ve deployment manifestleri ayrı sorumluluklardır.",
    },
  },
  {
    id: "sem-project-domain",
    level: "JR",
    category: "Internship SEM",
    prompt: "Staj yaptığın SEM (Sürekli Eğitim Merkezi) projesini mülakatta dürüst ve teknik şekilde nasıl anlatırsın?",
    answer:
      "SEM projesini eğitim, kurs, başvuru/kayıt, katılımcı, eğitmen, program ve sertifika gibi domain nesneleri üzerinden anlatabilirim. Stajyer olarak tüm mimariyi ben kurdum demek yerine, var olan Java projesinde belirli modülleri incelediğimi, unit test yazdığımı, servis metotlarının beklenen davranışlarını doğruladığımı, hata senaryolarını ve edge case'leri öğrendiğimi söylemek daha güvenilir olur. Kullandığım kesin araçları net söylerim; emin olmadığım teknolojileri ise 'projede karşılaşmış olabilirim ama aktif sorumluluğum unit test tarafındaydı' diye ayırırım.",
    keywords: ["sem", "staj", "unit test", "domain", "kurs", "katılımcı", "dürüst"],
    tags: ["Internship", "SEM", "Behavioral"],
    mcq: {
      options: [
        "Kullanmadığın teknolojileri daha güçlü görünmek için kullandım demelisin.",
        "Domain, sorumluluk ve yazdığın testleri net anlatıp emin olmadığın teknolojileri ayırmalısın.",
        "Staj projesinde unit test yazmak teknik deneyim sayılmaz.",
        "SEM projesini sadece frontend rengi üzerinden anlatmalısın.",
      ],
      correctIndex: 1,
      explanation:
        "Mülakatta güvenilirlik önemlidir; gerçek sorumluluğu net ama teknik bağlamla anlatmak en doğru yaklaşımdır.",
    },
  },
  {
    id: "sem-unit-test-stack",
    level: "JR-MID",
    category: "Internship SEM",
    prompt: "SEM projesinde Java unit test yazdıysan hangi teknolojileri kullanmış olabilirsin ve neyi test etmişsindir?",
    answer:
      "Tipik Java/Spring projelerinde unit test için JUnit 5, Mockito, AssertJ veya Spring Boot Test kullanılabilir. Controller testlerinde MockMvc veya WebTestClient; service testlerinde Mockito ile repository/client bağımlılıklarını mock'lamak; repository/integration testlerinde H2 ya da Testcontainers kullanmak mümkündür. SEM projesinde örneğin kurs başvuru validasyonu, kontenjan kontrolü, tarih çakışması, kayıt iptali veya sertifika uygunluğu gibi iş kuralları testlenebilir. Kesin kullanmadığın aracı 'kullandım' deme; 'bu tarz projede bu araçlar kullanılır, benim yazdığım testler service logic ve edge case odaklıydı' şeklinde sınır çiz.",
    keywords: ["junit 5", "mockito", "assertj", "mockmvc", "spring boot test", "edge case", "service"],
    tags: ["Internship", "JUnit", "Mockito", "Testing"],
    mcq: {
      options: [
        "Service unit testinde dış bağımlılıkları mock'lamak izolasyon sağlar.",
        "Unit test mutlaka gerçek production database'e bağlanmalıdır.",
        "Mockito endpoint dokümantasyonu üretir.",
        "MockMvc Kafka topic partition sayısını artırır.",
      ],
      correctIndex: 0,
      explanation:
        "Unit testte amaç iş kuralını hızlı ve izole doğrulamaktır; dış bağımlılıklar genellikle mock'lanır.",
    },
    followUps: [
      "Bir service metoduna unit test yazarken arrange-act-assert yapısını nasıl kurarsın?",
      "Unit test ile integration test farkını SEM projesinden örnekle açıkla.",
    ],
  },
  {
    id: "controller-service-test-strategy",
    level: "JR-MID",
    category: "Testing",
    prompt: "Controller, service ve repository katmanları için test stratejisini nasıl ayırırsın?",
    answer:
      "Controller testinde HTTP status, request validation, response body ve error mapping doğrulanır; MockMvc veya WebTestClient kullanılabilir. Service unit testinde business rule izole edilir; repository, external client veya mapper gibi bağımlılıklar Mockito ile mock'lanabilir. Repository testinde query ve mapping davranışı gerçekçi database ile doğrulanır; Testcontainers burada değerlidir. Her katmanda aynı şeyi tekrar test etmek yerine, riskli davranışı doğru seviyede testlemek gerekir.",
    keywords: ["controller test", "service test", "repository test", "mockmvc", "mockito", "testcontainers", "validation"],
    tags: ["Testing", "Layered Architecture"],
    mcq: {
      options: [
        "Her test sadece controller seviyesinde yazılmalıdır.",
        "Service unit test business rule'u izole eder, repository test query/mapping davranışını doğrular.",
        "Repository testinde HTTP status kontrol edilir.",
        "Controller testinde database index performansı ölçülür.",
      ],
      correctIndex: 1,
      explanation:
        "Katmanlara göre test amacı değişir; doğru test seviyesi bakım maliyetini azaltır.",
    },
  },
  {
    id: "crm-version-stack-risk",
    level: "JR-MID",
    category: "Project CRM",
    prompt: "Mülakatta çok güncel versiyonlar sorulursa Java 21, Spring Boot 4.0.6, Spring Cloud 2025.1.1 gibi bilgileri nasıl savunursun?",
    answer:
      "Versiyon numaralarını ezberlemek yerine neden seçildiğini ve projede neye temas ettiğimi anlatırım. Java 21 runtime ve language feature seviyesini, Spring Boot 4.0.6 uygulama geliştirme ve auto-configuration ekosistemini, Spring Cloud 2025.1.1 ise Gateway ve cloud-native integration tarafını temsil eder. Kritik nokta compatibility matrix, dependency management, BOM kullanımı, release notes okuma ve CI build ile doğrulamadır. Bilmediğim breaking change varsa uydurmam; projede karşılaştığım somut migration veya dependency sorununu anlatırım.",
    keywords: ["java 21", "spring boot 4", "spring cloud", "bom", "compatibility", "release notes", "ci"],
    tags: ["Versioning", "Spring Cloud", "Project"],
    mcq: {
      options: [
        "Versiyon uyumluluğu önemli değildir; her Spring Cloud her Boot sürümüyle çalışır.",
        "Güncel stack'te BOM, compatibility matrix, release notes ve CI build doğrulaması önemlidir.",
        "Java 21 kullanınca dependency management gerekmez.",
        "Breaking change sorulursa rastgele cevap vermek en iyisidir.",
      ],
      correctIndex: 1,
      explanation:
        "Modern Spring projelerinde versiyon hakimiyeti dependency yönetimi ve uyumluluk doğrulamasıyla birlikte anlatılır.",
    },
  },
];
