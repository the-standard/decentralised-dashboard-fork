import Card from "../../components/ui/Card";
import Typography from "../../components/ui/Typography";
import Button from "../../components/ui/Button";

import TheStandardHero from "../../assets/projects/hero.webp";
import ComingSoonHero from "../../assets/projects/comingsoon.png";
import TheKeyHero from "../../assets/projects/thekey.png";

// Tag Examples:
// Gaming
// Gambling
// NFT/Collectibles
// Social
// Staking/Yield
// Education
// USDs
// TST

const projectsData = [
  {
    name: 'TheKey.Fun',
    hero: TheKeyHero,
    tags: [
      'Gaming', 'USDs', 'Gambling',
    ],
    tagStyle: 'LIGHT',
    blurb: 'Buy The Key, reset the countdown, earn instant dividends, and watch the pot swell until a wild split-or-steal duel decides the winner. Jump in before the timer hits zero.',
    button: 'Play Now',
    link: 'https://thekey.fun',
  },
];

const Projects = () => {
  return (
    <main>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {projectsData?.length && projectsData
          .map(function(project, index) {
            let badgeColours = 'border-black-800 text-black-800';
            if (project.tagStyle === 'LIGHT') {
              badgeColours = 'border-neutral-200 text-white';
            }
            return (
              <Card className="flex-1 card-compact mb-4" key={index}>
                <div className="card-hero relative">
                  <img src={project.hero} className="" alt={project.name} />

                  <div className="flex gap-2 absolute bottom-0 mb-2 ml-2 opacity-80">
                    {project?.tags?.length && project?.tags
                      .map(function(tag, index) {
                        return (
                          <span 
                            className={`inline-flex items-center gap-x-1 py-0.5 px-2 rounded-full text-[.75rem] font-medium border border-current ${badgeColours}`}
                          >
                            #{tag}
                          </span>
                        )
                      })
                    }
                  </div>
                </div>
        
                <div className="card-body">

                  <div
                    className="flex flex-col md:flex-row"
                  >
                    <div className="flex flex-col my-auto mx-0">
                      <Typography variant="h2" className="card-title">
                        {project.name}
                      </Typography>
                      <Typography variant="small">
                        {project.blurb}
                      </Typography>
                    </div>
                  </div>
        
                  <div
                    className="card-actions flex-1 items-end"
                  >
                    <Button
                      className="w-auto"
                      color="primary"
                      onClick={
                        () => window.open(project.link, "_blank")
                      }
                    >
                      {project.button} &#8250;
                    </Button>
                  </div>
                </div>
              </Card>
            )
          })
        }

        {/* YOUR PROJECTS */}
        <Card className="flex-1 card-compact mb-4">
          <div className="card-hero relative">
            <img src={TheStandardHero} className="" alt={'Feature Your Project!'} />

            <div className="flex gap-2 absolute bottom-0 mb-2 ml-2 opacity-80">
              <span className="inline-flex items-center gap-x-1 py-0.5 px-2 rounded-full text-[.75rem] font-medium border border-neutral-200 text-white">
                #TST
              </span>
              <span className="inline-flex items-center gap-x-1 py-0.5 px-2 rounded-full text-[.75rem] font-medium border border-neutral-200 text-white">
                #USDs
              </span>
              <span className="inline-flex items-center gap-x-1 py-0.5 px-2 rounded-full text-[.75rem] font-medium border border-neutral-200 text-white">
                #Social
              </span>
            </div>
          </div>
  
          <div className="card-body">

            <div
              className="flex flex-col md:flex-row"
            >
              <div className="flex flex-col my-auto mx-0">
                <Typography variant="h2" className="card-title">
                  Feature Your Project!
                </Typography>
                <Typography variant="small">
                  Have a project or app that uses TheStandard's USDs or TST tokens? Want to have it featured here? Join our Discord and get in touch with the team!
                </Typography>
              </div>
            </div>
  
            <div
              className="card-actions flex-1 items-end"
            >
              <Button
                className="w-auto"
                color="primary"
                onClick={
                  () => window.open('https://discord.gg/THWyBQ4RzQ', "_blank")
                }
              >
                Discord &#8250;
              </Button>
            </div>
          </div>
        </Card>

        {/* COMING SOON */}
        <Card className="flex-1 card-compact mb-4">
          <div className="card-hero relative">
            <img src={ComingSoonHero} className="" alt={'Coming Soon'} />

            <div className="flex gap-2 absolute bottom-0 mb-2 ml-2 opacity-80">
              <span className="inline-flex items-center gap-x-1 py-0.5 px-2 rounded-full text-[.75rem] font-medium border border-neutral-200 text-white">
                #USDs
              </span>
              <span className="inline-flex items-center gap-x-1 py-0.5 px-2 rounded-full text-[.75rem] font-medium border border-neutral-200 text-white">
                #TST
              </span>
              <span className="inline-flex items-center gap-x-1 py-0.5 px-2 rounded-full text-[.75rem] font-medium border border-neutral-200 text-white">
                #ComingSoon
              </span>
            </div>
          </div>
  
          <div className="card-body">
            <div
              className="flex flex-col md:flex-row"
            >
              <div className="flex flex-col my-auto mx-0">
                <Typography variant="h2" className="card-title">
                  Coming Soon!
                </Typography>
                <Typography variant="small">
                  Keep your eyes peeled for new projects being added!
                </Typography>
              </div>
            </div>
  
            <div
              className="card-actions flex-1 items-end"
            >
              <Button
                className="w-auto"
                color="primary"
                disabled
              >
                Coming Soon &#8250;
              </Button>
            </div>
          </div>
        </Card>

      </div>
    </main>
  );
};

export default Projects;