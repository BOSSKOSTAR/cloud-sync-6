import { Card, CardContent } from "@/components/ui/card"
import { ExternalLink } from "lucide-react"
import { Button } from "@/components/ui/button"

const projects = [
  {
    title: "Рост продаж интернет-магазина",
    category: "Таргетированная реклама",
    image: "/modern-ecommerce-website.png",
    description:
      "Выстроили систему таргетированной рекламы ВКонтакте для fashion-ритейлера. За 3 месяца увеличили выручку с рекламных каналов в 2.8 раза при снижении стоимости привлечения на 34%.",
    url: "#portfolio",
    tags: ["ВКонтакте Ads", "Таргетинг", "e-commerce", "ROAS ×2.8"],
  },
  {
    title: "SMM для ресторанной сети",
    category: "Контент и SMM",
    image: "/restaurant-website-design.png",
    description:
      "Разработали контент-стратегию и запустили SMM для сети из 5 ресторанов. За полгода подписчики выросли с 2 000 до 28 000, посещаемость заведений увеличилась на 41%.",
    url: "#portfolio",
    tags: ["Instagram", "ВКонтакте", "Контент", "+1300% подписчиков"],
  },
  {
    title: "SEO для B2B-компании",
    category: "SEO и контент-маркетинг",
    image: "/professional-corporate-website.png",
    description:
      "Вывели промышленную компанию в топ-3 по 120+ целевым запросам. Органический трафик вырос с 800 до 9 400 визитов в месяц, количество заявок из поиска — в 6 раз.",
    url: "#portfolio",
    tags: ["SEO", "Контент", "B2B", "+1075% трафика"],
  },
  {
    title: "Комплексный маркетинг стартапа",
    category: "Полный цикл",
    image: "/creative-portfolio-website.png",
    description:
      "Запустили маркетинг с нуля для EdTech-стартапа. Выстроили воронку от осведомлённости до покупки через 4 канала одновременно. За год — 12 000 платных пользователей.",
    url: "#portfolio",
    tags: ["Стратегия", "SEO", "Таргетинг", "Аналитика"],
  },
]

export function PortfolioSection() {
  return (
    <section id="portfolio" className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="container mx-auto max-w-7xl">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6 text-balance">Наши кейсы</h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto text-pretty leading-relaxed">
            Реальные результаты для реального бизнеса. Каждый кейс — это измеримый рост, который мы достигли вместе с клиентом.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {projects.map((project, index) => (
            <Card
              key={index}
              className="group overflow-hidden border-none shadow-md hover:shadow-xl transition-all duration-300"
            >
              <div className="relative overflow-hidden aspect-video">
                <img
                  src={project.image || "/placeholder.svg"}
                  alt={project.title}
                  className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background/95 via-background/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-6">
                  <Button
                    size="sm"
                    variant="secondary"
                    className="gap-2"
                    onClick={() => window.open(project.url, "_blank")}
                  >
                    Подробнее <ExternalLink className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <CardContent className="p-6">
                <p className="text-sm text-primary font-semibold mb-2">{project.category}</p>
                <h3 className="text-xl font-bold mb-2">{project.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed mb-4">{project.description}</p>
                <div className="flex flex-wrap gap-2">
                  {project.tags.map((tag, tagIndex) => (
                    <span key={tagIndex} className="text-xs px-2 py-1 rounded-full bg-muted text-muted-foreground">
                      {tag}
                    </span>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}