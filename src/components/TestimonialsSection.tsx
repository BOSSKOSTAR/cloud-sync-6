import { useEffect, useRef } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Quote } from "lucide-react"

const testimonials = [
  {
    quote:
      "За 4 месяца работы с Matrix наши продажи через онлайн-каналы выросли втрое. Команда чётко выстроила стратегию и каждую неделю показывала конкретные цифры — никакой воды.",
    name: "Алексей Воронов",
    role: "Владелец интернет-магазина",
  },
  {
    quote:
      "Наконец нашли агентство, которое говорит на языке бизнеса, а не маркетинговых терминов. Matrix выстроили нам систему привлечения клиентов, которая работает сама — мы просто смотрим на дашборд и радуемся.",
    name: "Екатерина Сомова",
    role: "Директор по развитию, EdTech",
  },
  {
    quote:
      "Пробовали много агентств — всегда красивые презентации и нулевой результат. Matrix отличаются тем, что берутся только за то, в чём уверены, и доводят до KPI. Теперь работаем уже второй год.",
    name: "Дмитрий Карев",
    role: "Основатель ресторанной сети",
  },
  {
    quote:
      "SEO-направление Matrix вывело нас в топ по нашим ключевым запросам за 5 месяцев. Органика теперь даёт 60% всех заявок — мы снизили рекламный бюджет вдвое при том же объёме продаж.",
    name: "Ирина Белова",
    role: "Маркетинг-директор B2B",
  },
]

export function TestimonialsSection() {
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const scrollContainer = scrollRef.current
    if (!scrollContainer) return

    let animationFrameId: number
    let scrollPosition = 0
    const scrollSpeed = 0.5

    const scroll = () => {
      scrollPosition += scrollSpeed

      if (scrollContainer.scrollWidth && scrollPosition >= scrollContainer.scrollWidth / 2) {
        scrollPosition = 0
      }

      scrollContainer.scrollLeft = scrollPosition
      animationFrameId = requestAnimationFrame(scroll)
    }

    animationFrameId = requestAnimationFrame(scroll)

    return () => {
      cancelAnimationFrame(animationFrameId)
    }
  }, [])

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-muted/30 overflow-hidden">
      <div className="container mx-auto max-w-7xl">
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-center mb-4 text-balance">
          Что говорят наши клиенты
        </h2>
        <p className="text-center text-muted-foreground mb-12 max-w-3xl mx-auto text-pretty leading-relaxed">
          Мы оцениваем себя по результатам клиентов, а не по красивым презентациям. Вот что говорят те, с кем мы уже прошли путь к росту.
        </p>

        <div className="relative">
          <div ref={scrollRef} className="flex gap-6 overflow-x-hidden" style={{ scrollBehavior: "auto" }}>
            {/* Duplicate testimonials for seamless loop */}
            {[...testimonials, ...testimonials].map((testimonial, index) => (
              <Card key={index} className="flex-shrink-0 w-[90vw] sm:w-[450px] border-none shadow-lg">
                <CardContent className="p-8">
                  <Quote className="h-8 w-8 text-primary mb-4" />
                  <p className="text-base sm:text-lg mb-6 leading-relaxed text-pretty min-h-[120px]">
                    {testimonial.quote}
                  </p>
                  <div>
                    <p className="font-semibold text-lg">{testimonial.name}</p>
                    <p className="text-muted-foreground text-sm">{testimonial.role}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}