import Card from "../components/ui/Card";
import Typography from "../components/ui/Typography";

const TermsOfUse = () => {
  return (
    <Card className="card-compact">
      <div className="card-body">

        <div>
          <Typography variant="h1">
            Terms of Service for TheStandard.io
          </Typography>
        </div>

        <div className="flex flex-col">
          <Typography variant="p">
            Last Updated: [5.NOV.2023]
          </Typography>

          <Typography variant="h3" className="mt-4">
            1. Introduction
          </Typography>
          <Typography variant="p">
            Welcome to TheStandard.io. This website provides a decentralized finance (DeFi) lending platform through which users can interact with various blockchain-based smart contracts and interfaces. By using TheStandard.io, you agree to be bound by these Terms of Service and acknowledge that you have read and understood them.
          </Typography>

          <Typography variant="h3" className="mt-4">
            2. Acceptance of Risk
          </Typography>
          <Typography variant="p">
            As a user of TheStandard.io, you acknowledge and agree that:
            <br/><br/>
            2.1. Risk of Blockchain and Smart Contracts: Dealing with blockchain technology and smart contracts involves several risks. The technology is relatively new and may have undiscovered vulnerabilities. You understand that this could expose you to risks of hacks, code vulnerabilities, and unforeseen events in the blockchain network.
            <br/><br/>
            2.2. Responsibility for Decisions: You are solely responsible for all decisions made and actions taken in relation to your use of TheStandard.io and its smart contracts and interfaces.
            <br/><br/>
            2.3. No Liability for Losses: TheStandard.io, its developers, team members, or affiliates shall not be liable for any losses you may incur as a result of using our platform. This includes, but is not limited to, losses due to smart contract vulnerabilities, hacks, technical failures, or fluctuations in cryptocurrency value.
            <br/><br/>
            2.4. Absence of Guarantees: The platform does not guarantee any profits or protection from losses. Your use of TheStandard.io is at your own risk, and you should only commit assets that you are prepared to lose entirely.
          </Typography>

          <Typography variant="h3" className="mt-4">
            3. Acknowledgment of Risks
          </Typography>
          <Typography variant="p">
            By using TheStandard.io, you acknowledge that:
            <br/><br/>
            3.1. Potential for Losses: You understand and accept the risk that comes with the use of blockchain technology and smart contracts, which could result in total loss of your assets.
            <br/><br/>
            3.2. No Recourse: In the event of any losses, including those resulting from vulnerabilities, hacks, or any other security issues in the smart contracts, you agree that you have no recourse against TheStandard.io, its developers, team members, or affiliates.
            <br/><br/>
            3.3. Due Diligence: You have the necessary knowledge and experience in blockchain technology and understand the risks involved. You are also responsible for conducting your own due diligence regarding your transactions.
          </Typography>

          <Typography variant="h3" className="mt-4">
            4. No Liability
          </Typography>
          <Typography variant="p">
            TheStandard.io shall not be liable for any of the following:
            <br/><br/>
            4.1. Technical Failures: Any technical malfunction, breakdown, delay, or failure of the website or the underlying blockchain network.
            <br/><br/>
            4.2. Market Risks: Changes in market conditions that affect the value of cryptocurrencies or assets used on the platform.
            <br/><br/>
            4.3. Regulatory Changes: Any loss due to changes in regulatory status, legal challenges, or other external factors affecting the use of cryptocurrencies or blockchain technology.
            <br/><br/>
            4.4.1 You acknowledge and understand that the smart contracts used by TheStandard.io are experimental computer programs that may contain unforeseen vulnerabilities or errors. These vulnerabilities or errors could potentially lead to the loss of your assets.
            <br/><br/>
            4.4.2 By using TheStandard.io smart contracts, you expressly acknowledge and accept these inherent risks. You further acknowledge and accept that you, the user, bear sole responsibility for any losses that may occur as a result of using TheStandard.io smart contracts, regardless of the cause of such losses.
            <br/><br/>
            4.4.3 Under no circumstances shall TheStandard.io's developers, TST token holders, or other users of the platform be liable for any losses you may incur as a result of using TheStandard.io smart contracts.
            <br/><br/>
            4.4.4 YOU USE THE STANDARD.IO SMART CONTRACTS AT YOUR OWN RISK.
          </Typography>

          <Typography variant="h3" className="mt-4">
            5. Amendments to Terms
          </Typography>
          <Typography variant="p">
            TheStandard.io reserves the right to modify or amend these Terms of Service at any time. Your continued use of the platform after any such changes constitutes your acceptance of the new Terms of Service.
          </Typography>

          <Typography variant="h3" className="mt-4">
            6. Contact Information
          </Typography>
          <Typography variant="p">
            If you have any questions regarding these Terms of Service, please contact us on discord which is linked from TheStandard.io website.
          </Typography>


        </div>
      </div>
    </Card>
  );
};

export default TermsOfUse;