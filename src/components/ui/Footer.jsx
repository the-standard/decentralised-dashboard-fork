import {
  useCurrentTheme,
} from "../../store/Store";

import Button from "./Button";

import twitterLogo from "../../assets/twitterlogo.svg";
import linkedinlogo from "../../assets/linkedinlogo.svg";
import youtubelogo from "../../assets/youtubelogo.svg";
import discordlogo from "../../assets/discordlogo.svg";
import telegramlogo from "../../assets/telegramlogo.svg";
import githublogo from "../../assets/githublogo.svg";

const links = [
  { name: "Home", link: "https://TheStandard.io" },
  { name: "About", link: "https://www.thestandard.io/about" },
  { name: "Whitepaper", link: "https://www.thestandard.io/tst-whitepaper" },
  { name: "Blog", link: "https://thestandard.io/blog" },
  { name: "Terms of Use", link: "/termsofuse" },
];

const icons = [
  {
    name: 'Discord',
    logo: discordlogo,
    link: "https://discord.gg/THWyBQ4RzQ",
  },
  {
    name: 'LinkedIn',
    logo: linkedinlogo,
    link: "https://www.linkedin.com/company/the-standard-io",
  },
  {
    name: 'Twitter',
    logo: twitterLogo,
    link: "https://twitter.com/thestandard_io",
  },
  {
    name: 'YouTube',
    logo: youtubelogo,
    link: "https://www.youtube.com/@TheStandard_io",
  },
  {
    name: 'Telegram',
    logo: telegramlogo,
    link: "https://t.me/TheStandard_io",
  },
  {
    name: 'Github',
    logo: githublogo,
    link: "https://github.com/the-standard",
  },
];

const Footer = (props) => {
  const { currentTheme } = useCurrentTheme();
  const isLight = currentTheme && currentTheme.includes('light');

  return (
    <footer className="tst-footer items-center p-4 tst-footer mt-20 gap-2 flex flex-col md:flex-row">
      <aside className="w-full flex flex-row align-center justify-center md:justify-start flex-wrap md:flex-nowrap gap-4">
        {links.map((link) => (
          <a
            key={link.name}
            href={link.link}
            target="_blank"
          >
            {link.name}
          </a>
        ))}
      </aside> 
      <nav className="w-full flex flex-row align-center justify-center md:justify-end flex-wrap md:flex-nowrap gap-1">
        {icons.map((icon) => (
          <Button
            size="sm"
            color="ghost"
            onClick={() => window.open(icon.link, "_blank")}
          >
            <img
              className={
                isLight ? (
                  icon.name === 'Telegram' ? (
                      'h-4 w-4 inline-block'
                    ) : (
                      'h-4 w-4 inline-block invert'
                    )
                ) : (
                  'h-4 w-4 inline-block'
                )
              }
              src={icon.logo}
              alt={`${icon.name} logo`}
            />
          </Button>
        ))}
      </nav>
    </footer>
  )
};

export default Footer;