import Link from "next/link";
import Image from "next/image";
import {
  Moon,
  Volume2,
  ThermometerSun,
  Bell,
  ArrowRight,
  ShieldAlert,
  Camera,
} from "lucide-react";

export const metadata = {
  title: "Roomie",
};

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white">
      <div className="max-w-5xl mx-auto px-4 py-10 flex flex-col gap-10">
        {/* 🔹 Logo + titel */}
        <header className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center shadow-lg">
            <Image
              src="/roomie.svg"
              alt="Roomie logo"
              width={36}
              height={36}
              className="w-10 h-11"
            />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold leading-tight">
              Roomie
            </h1>
            <p className="text-sm text-purple-200">
              Jouw slimme kamer vriend voor rustige bedtijden
            </p>
          </div>
        </header>

        {/* 🔹 Hoofdsectie */}
        <main className="grid gap-10 md:grid-cols-[1.3fr,1fr] items-start">
          {/* Linkerkant: uitleg + CTA */}
          <section className="space-y-6">
            {/* Kleine badge */}
            <div className="inline-flex items-center gap-2 rounded-full bg-white/10 border border-white/20 px-3 py-1 text-xs text-purple-100">
              <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
              <span>Ontworpen voor ouders en kinderen 💤</span>
            </div>

            {/* Titel + uitleg */}
            <div className="space-y-3">
              <h2 className="text-3xl sm:text-4xl font-semibold leading-tight">
                Één overzicht voor verhalen, licht, geluid en veiligheid.
              </h2>
              <p className="text-sm sm:text-base text-slate-200">
                Roomie helpt bij het avondritueel: je kiest een verhaaltje,
                stelt een tijd in en Roomie zorgt voor een rustige sfeer
                in de kamer van je kind. Jij houdt het overzicht, zonder
                honderd apps of knopjes.
              </p>
            </div>

            {/* CTA knop naar dashboard */}
            <div className="flex flex-col sm:flex-row gap-3">
              <Link
                href="/dashboard"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 px-6 py-3 text-sm sm:text-base font-medium shadow-lg hover:from-purple-600 hover:to-pink-600 transition-all"
              >
                Ga naar Roomie dashboard
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            {/* Korte bullets over wat Roomie doet */}
            <div className="grid gap-3 sm:grid-cols-2 text-sm text-slate-200">
              <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
                <p className="font-semibold mb-1">Rustig bedtijdritueel</p>
                <p className="text-xs sm:text-sm text-slate-200/80">
                  Kies een verhaaltje, pas de tekst aan en plan het in
                  voor een vast tijdstip. Roomie doet de rest.
                </p>
              </div>
              <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
                <p className="font-semibold mb-1">Altijd overzicht</p>
                <p className="text-xs sm:text-sm text-slate-200/80">
                  Temperatuur, geluid, licht en nachtlog allemaal op één plek,
                  speciaal voor ouders.
                </p>
              </div>
            </div>
          </section>

          {/* Rechterkant: features + gebruik in stappen */}
          <aside className="space-y-5">
            {/* Belangrijkste functies */}
            <div className="bg-white/10 border border-white/20 rounded-2xl p-5 backdrop-blur space-y-4">
              <h3 className="text-lg font-semibold">
                Wat kun je met Roomie?
              </h3>
              <ul className="space-y-3 text-sm text-slate-100/90">
                <li className="flex gap-3">
                  <div className="mt-0.5">
                    <Volume2 className="w-4 h-4 text-purple-300" />
                  </div>
                  <div>
                    <p className="font-medium">Bedtijd-verhalen</p>
                    <p className="text-slate-200/80 text-xs sm:text-sm">
                      Voeg eigen verhaaltjes toe, pas de tekst aan en plan ze
                      in zodat Roomie ze automatisch afspeelt op bedtijd.
                    </p>
                  </div>
                </li>

                <li className="flex gap-3">
                  <div className="mt-0.5">
                    <Camera className="w-4 h-4 text-blue-300" />
                  </div>
                  <div>
                    <p className="font-medium">Live camera & praten</p>
                    <p className="text-slate-200/80 text-xs sm:text-sm">
                      Via de camera-tab kun je – wanneer jij dat wilt –
                      even meekijken in de kamer en met je kind praten
                      via de microfoon.
                    </p>
                  </div>
                </li>

                <li className="flex gap-3">
                  <div className="mt-0.5">
                    <ThermometerSun className="w-4 h-4 text-orange-300" />
                  </div>
                  <div>
                    <p className="font-medium">Kamer in balans</p>
                    <p className="text-slate-200/80 text-xs sm:text-sm">
                      Zie in één oogopslag temperatuur, luchtvochtigheid,
                      lichtsterkte en geluidsniveau in de kamer.
                    </p>
                  </div>
                </li>

                <li className="flex gap-3">
                  <div className="mt-0.5">
                    <Bell className="w-4 h-4 text-yellow-300" />
                  </div>
                  <div>
                    <p className="font-medium">Zachte herinneringen</p>
                    <p className="text-slate-200/80 text-xs sm:text-sm">
                      Roomie geeft een zachte bel als het bijna tijd is voor
                      het verhaaltje, zodat het avondritueel rustig kan starten.
                    </p>
                  </div>
                </li>

                <li className="flex gap-3">
                  <div className="mt-0.5">
                    <ShieldAlert className="w-4 h-4 text-red-300" />
                  </div>
                  <div>
                    <p className="font-medium">Noodknop</p>
                    <p className="text-slate-200/80 text-xs sm:text-sm">
                      Met één druk op de knop activeer je een noodscherm
                      en kun je extra goed opletten als er iets aan de hand is.
                    </p>
                  </div>
                </li>
              </ul>
            </div>

            {/* Hoe gebruik je Roomie in de avond? */}
            <div className="bg-black/20 border border-purple-400/40 rounded-2xl p-5 text-xs sm:text-sm text-slate-100/90 space-y-3">
              <p className="font-semibold">
                Hoe gebruik je Roomie in de avond?
              </p>
              <ol className="list-decimal list-inside space-y-1.5">
                <li>Log in op het Roomie dashboard.</li>
                <li>
                  Ga naar de tab <strong>Verhalen</strong> en kies of maak een
                  verhaaltje.
                </li>
                <li>
                  Stel een tijd in voor vanavond in de{" "}
                  <strong>planning</strong>.
                </li>
                <li>
                  Controleer het nachtlampje en de kamergegevens in het{" "}
                  <strong>Overzicht</strong>.
                </li>
                <li>
                  Wil je even meekijken of iets zeggen tegen je kind?
                  Gebruik dan de tab <strong>Camera</strong> voor live beeld
                  en microfoon.
                </li>
                <li>
                  Roomie speelt het verhaaltje automatisch af op de gekozen
                  tijd via het apparaat in de kamer.
                </li>
              </ol>
            </div>
          </aside>
        </main>

        {/* Footer */}
        <footer className="border-t border-white/10 pt-4 mt-2 text-xs sm:text-sm text-slate-300 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>Roomie – slimme kamer-assistent voor kinderen</span>
          <span className="text-slate-400">
            Bedien verhalen, licht en live meekijken eenvoudig via het dashboard.
          </span>
        </footer>
      </div>
    </div>
  );
}
