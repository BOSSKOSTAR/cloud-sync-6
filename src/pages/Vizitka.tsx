import { Button } from "@/components/ui/button";
import Icon from "@/components/ui/icon";

const Vizitka = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-950 to-gray-900 flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        {/* Card */}
        <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-purple-500/30">
          {/* Background image */}
          <div
            className="absolute inset-0 bg-cover bg-center opacity-20"
            style={{ backgroundImage: `url(https://cdn.poehali.dev/projects/37f6797b-2bcf-4239-aa52-cd5768175cd6/files/672f5afd-150c-4fb6-b0ba-829b5e202eed.jpg)` }}
          />

          {/* Content */}
          <div className="relative z-10 p-8 flex flex-col items-center text-center gap-6">
            {/* Avatar circle */}
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center shadow-lg shadow-orange-500/40">
              <span className="text-3xl font-black text-white">В</span>
            </div>

            {/* Name */}
            <div>
              <h1 className="text-4xl font-black text-white tracking-widest uppercase">
                ВИТАМИН
              </h1>
              <div className="mt-1 h-0.5 w-16 bg-gradient-to-r from-yellow-400 to-orange-500 mx-auto rounded-full" />
            </div>

            {/* Description */}
            <p className="text-gray-300 text-base leading-relaxed">
              Помогу <span className="text-yellow-400 font-bold">заработать</span> и помогу в <span className="text-yellow-400 font-bold">продвижении</span>
            </p>

            {/* Divider */}
            <div className="w-full border-t border-purple-500/30" />

            {/* Buttons */}
            <div className="w-full flex flex-col gap-3">
              <a href="https://vk.com/bosskostar" target="_blank" rel="noopener noreferrer">
                <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl py-5 text-base gap-2">
                  <Icon name="Users" size={20} />
                  ВКонтакте
                </Button>
              </a>

              <a href="tel:+79516152257">
                <Button className="w-full bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white font-bold rounded-xl py-5 text-base gap-2">
                  <Icon name="Phone" size={20} />
                  +7 951 615-22-57
                </Button>
              </a>

              <a href="https://preview--cloud-sync-6.poehali.dev/register?ref=D62OI096" target="_blank" rel="noopener noreferrer">
                <Button className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-bold rounded-xl py-5 text-base gap-2">
                  <Icon name="Rocket" size={20} />
                  Зарегистрироваться и заработать
                </Button>
              </a>
            </div>

            {/* Tag */}
            <p className="text-gray-500 text-xs">
              Нажми и свяжись со мной прямо сейчас
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Vizitka;