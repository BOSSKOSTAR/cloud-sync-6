import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart2, Share2, Target, Search, Megaphone, LineChart } from "lucide-react"

const services = [
  {
    icon: Target,
    title: "Маркетинговая стратегия",
    description:
      "Разрабатываем матричную стратегию продвижения под ваш бизнес: анализ конкурентов, определение целевой аудитории, выбор каналов и постановка измеримых целей на каждом уровне воронки.",
  },
  {
    icon: Share2,
    title: "SMM и контент",
    description:
      "Создаём контент-стратегию и ведём ваши социальные сети. Регулярные публикации, сторис, видео и вовлекающие посты — всё для роста аудитории и конверсии в покупателей.",
  },
  {
    icon: Megaphone,
    title: "Таргетированная реклама",
    description:
      "Запускаем рекламные кампании ВКонтакте, Telegram Ads и других платформах. Точный таргетинг, A/B-тестирование объявлений и оптимизация бюджета для максимального ROI.",
  },
  {
    icon: Search,
    title: "SEO и контент-маркетинг",
    description:
      "Выводим сайт в топ поисковых систем. Семантическое ядро, оптимизация страниц, качественный контент и наращивание ссылочной массы — комплексный подход к органическому трафику.",
  },
  {
    icon: BarChart2,
    title: "Аналитика и отчётность",
    description:
      "Настраиваем сквозную аналитику от показа рекламы до продажи. Дашборды в реальном времени, еженедельные отчёты и прозрачные KPI — вы всегда знаете, куда уходит бюджет.",
  },
  {
    icon: LineChart,
    title: "Рост и масштабирование",
    description:
      "После достижения первых результатов масштабируем успешные каналы. Тестируем новые гипотезы, расширяем аудиторию и строим устойчивую систему привлечения клиентов.",
  },
]

export function ServicesSection() {
  return (
    <section id="services" className="py-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-primary/5 animate-pulse" />

      <div className="container mx-auto max-w-7xl relative z-10">
        <div className="inline-block mb-4 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-semibold mx-auto block w-fit">
          Наша экспертиза
        </div>
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-center mb-4 text-balance">
          В чём мы <span className="text-primary">сильны</span>
        </h2>
        <p className="text-center text-muted-foreground mb-12 max-w-3xl mx-auto text-pretty leading-relaxed text-lg">
          Матричная структура агентства позволяет работать по всем направлениям маркетинга одновременно — без потери фокуса и качества.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service, index) => (
            <Card
              key={index}
              className="group hover:border-primary transition-all duration-300 hover:shadow-xl hover:-translate-y-2 bg-background/50 backdrop-blur-sm"
            >
              <CardHeader>
                <div className="mb-4 inline-flex p-3 rounded-lg bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300 group-hover:scale-110 group-hover:rotate-3">
                  <service.icon className="h-6 w-6" />
                </div>
                <CardTitle className="text-xl group-hover:text-primary transition-colors">{service.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base leading-relaxed">{service.description}</CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}