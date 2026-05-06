import { Button } from "@/components/ui/button";
import Icon from "@/components/ui/icon";

const Avito = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
          {/* Авито-шапка */}
          <div className="bg-[#00AAFF] px-6 py-4 flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center shadow">
              <span className="text-2xl font-black text-[#00AAFF]">В</span>
            </div>
            <div>
              <p className="text-white font-bold text-lg leading-tight">ВИТАМИН</p>
              <p className="text-blue-100 text-xs">Онлайн-консультант</p>
            </div>
          </div>

          {/* Объявление */}
          <div className="px-6 py-5 flex flex-col gap-4">
            <div>
              <h2 className="text-gray-900 font-black text-xl leading-tight">
                Помогу заработать в интернете — от 300 руб. в месяц
              </h2>
              <p className="text-gray-500 text-xs mt-1">Услуги • Обучение и консультации</p>
            </div>

            <p className="text-gray-700 text-sm leading-relaxed">
              Проверенная система заработка в интернете. Регистрация <span className="font-bold text-gray-900">бесплатно</span>, первый результат уже через несколько дней. Тарифы от 300 руб. Потенциальный доход до <span className="font-bold text-green-600">5 880 000 руб.</span>
            </p>

            <div className="bg-gray-50 rounded-xl p-4 flex flex-col gap-2 text-sm text-gray-700">
              <div className="flex items-center gap-2">
                <Icon name="CheckCircle" size={16} className="text-green-500 shrink-0" />
                <span>Работаешь из дома, в удобное время</span>
              </div>
              <div className="flex items-center gap-2">
                <Icon name="CheckCircle" size={16} className="text-green-500 shrink-0" />
                <span>Помогаю на каждом шаге</span>
              </div>
              <div className="flex items-center gap-2">
                <Icon name="CheckCircle" size={16} className="text-green-500 shrink-0" />
                <span>Без опыта — обучу с нуля</span>
              </div>
            </div>

            <div className="flex flex-col gap-3 pt-1">
              <a href="tel:+79516152257">
                <Button className="w-full bg-[#00AAFF] hover:bg-blue-500 text-white font-bold rounded-xl py-5 text-base gap-2">
                  <Icon name="Phone" size={18} />
                  Позвонить: +7 951 615-22-57
                </Button>
              </a>

              <a href="https://vk.com/bosskostar" target="_blank" rel="noopener noreferrer">
                <Button variant="outline" className="w-full border-blue-600 text-blue-600 hover:bg-blue-50 font-bold rounded-xl py-5 text-base gap-2">
                  <Icon name="Users" size={18} />
                  Написать ВКонтакте
                </Button>
              </a>

              <a href="https://preview--cloud-sync-6.poehali.dev/register?ref=D62OI096" target="_blank" rel="noopener noreferrer">
                <Button className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-bold rounded-xl py-5 text-base gap-2">
                  <Icon name="Rocket" size={18} />
                  Зарегистрироваться бесплатно
                </Button>
              </a>
            </div>

            <p className="text-center text-gray-400 text-xs">
              Нажми — отвечу в течение часа
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Avito;
