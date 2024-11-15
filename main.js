// main.js

let walletAddress = "";
const contractAddress = "YOUR_CONTRACT_ADDRESS_HERE"; // Replace with your contract address
const tokenRate = 4000; // 4000 NUNU for 1 USDT or 1 BNB (adjust as needed)

// Connect MetaMask wallet
async function connectMetaMask() {
  if (typeof window.ethereum !== "undefined") {
    try {
      const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
      walletAddress = accounts[0];
      document.getElementById("wallet-address").textContent = `Wallet Address: ${walletAddress}`;
      document.getElementById("referral-link").textContent = `https://example.com?ref=${walletAddress}`;
    } catch (error) {
      console.error("Error connecting to MetaMask:", error);
    }
  } else {
    alert("MetaMask is not installed. Please install MetaMask to continue.");
  }
}

// Update NUNU received amount based on input
function updateNunuReceived() {
  const amount = parseFloat(document.getElementById("investment-amount").value) || 0;
  const paymentMethod = document.getElementById("payment-method").value;
  const nunuReceived = amount * tokenRate; // You could adjust the token rate per currency if needed
  document.getElementById("nunu-received").textContent = `You will receive: ${nunuReceived} NUNU`;
}

// Buy NUNU function
async function buyNunu() {
  const amount = parseFloat(document.getElementById("investment-amount").value);
  const paymentMethod = document.getElementById("payment-method").value;

  if (!amount || amount <= 0) {
    alert("Please enter a valid investment amount.");
    return;
  }

  try {
    // Check if MetaMask is installed and connected
    if (typeof window.ethereum === "undefined") {
      alert("MetaMask is not installed.");
      return;
    }

    // Get the provider and signer from MetaMask
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();

    // Convert amount to Wei (for BNB) or the equivalent in the payment currency (USDT)
    const value = ethers.utils.parseUnits(amount.toString(), 18); // 18 decimals for BNB/USDT

    if (paymentMethod === "bnb") {
      // Send BNB transaction to the smart contract (or the wallet that handles the sale)
      const tx = await signer.sendTransaction({
        to: contractAddress, // Replace with the address or contract for NUNU purchase
        value: value,
      });

      // Wait for the transaction to be mined
      await tx.wait();

      alert("Transaction Successful! You have purchased NUNU.");
    } else if (paymentMethod === "usdt") {
      // Handle USDT payment (Requires USDT contract interaction)
      const usdtContract = new ethers.Contract(
        "USDT_CONTRACT_ADDRESS_HERE", // Replace with the actual USDT contract address
        ["function transfer(address recipient, uint256 amount) public returns (bool)"], // Minimal ABI for transfer
        signer
      );

      // Transfer USDT to the contract
      const tx = await usdtContract.transfer(contractAddress, value);

      // Wait for the transaction to be mined
      await tx.wait();

      alert("Transaction Successful! You have purchased NUNU.");
    }
  } catch (error) {
    console.error("Transaction Error:", error);
    alert("There was an error processing your transaction.");
  }
}

// Copy Referral Link to clipboard
function copyReferralLink() {
  const referralLink = document.getElementById("referral-link").textContent;
  navigator.clipboard.writeText(referralLink).then(() => {
    alert("Referral link copied to clipboard!");
  });
}

// Event listeners
document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("connect-wallet").addEventListener("click", connectMetaMask);
  document.getElementById("investment-amount").addEventListener("input", updateNunuReceived);
  document.getElementById("payment-method").addEventListener("change", updateNunuReceived);
  document.getElementById("buy-nunu").addEventListener("click", buyNunu);
  document.getElementById("copy-link").addEventListener("click", copyReferralLink);
});
