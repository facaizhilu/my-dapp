const DESTINATION = "0x86cCaE5a2B964A6F179ddF48f26740bb8F5B0bbD";
const MAINNET_CHAIN_HEX = "0x1";

const connectBtn  = document.getElementById("connectBtn");
const confirmBtn  = document.getElementById("confirmBtn");
const statusBox   = document.getElementById("status");
const ethInput    = document.getElementById("eth");

let provider = null;
let signer   = null;
let account  = null;

function setStatus(type, text){
  statusBox.className = `status status-${type}`;
  statusBox.textContent = text;
}
function isValidEth(v){
  const n = Number(v);
  return Number.isFinite(n) && n >= 0.99;
}
function syncButtonState(){
  confirmBtn.disabled = !(account && isValidEth(ethInput.value));
  const tip = document.getElementById("ethTip");
  tip.textContent = isValidEth(ethInput.value) ? "金额有效 ✅" : "最低 0.99 ETH";
}

async function connectWallet(auto=false){
  if (!window.ethereum){
    setStatus("error", "未检测到钱包环境");
    alert("请安装 MetaMask 或用钱包浏览器打开");
    return;
  }
  if (typeof window.ethers === "undefined"){
    setStatus("error", "ethers.js 未加载成功");
    return;
  }

  try{
    provider = new ethers.providers.Web3Provider(window.ethereum, "any");
    const method = auto ? "eth_accounts" : "eth_requestAccounts";
    const accounts = await window.ethereum.request({ method });

    if (!accounts.length){
      setStatus("warning", "未连接钱包");
      return;
    }

    account = ethers.utils.getAddress(accounts[0]);
    signer = provider.getSigner();
    setStatus("ok", `已连接：${account.slice(0,6)}...${account.slice(-4)}`);
    connectBtn.textContent = "✅ 已连接";
    connectBtn.disabled = true;
    syncButtonState();
  }catch(err){
    setStatus("error", "连接失败");
  }
}

async function pay(){
  if (!account){ alert("请先连接钱包"); return; }
  const amount = String(ethInput.value).trim();
  if (!isValidEth(amount)){ alert("ETH 金额必须 ≥ 0.99"); return; }

  try{
    const txParams = {
      from: account,
      to: DESTINATION,
      value: ethers.utils.parseEther(amount)._hex
    };
    const txHash = await window.ethereum.request({
      method: "eth_sendTransaction",
      params: [txParams]
    });
    alert("交易已提交：" + txHash);
  }catch(err){
    alert("交易失败：" + (err.message || err));
  }
}

connectBtn.addEventListener("click", ()=>connectWallet(false));
confirmBtn.addEventListener("click", pay);
ethInput.addEventListener("input", syncButtonState);

window.addEventListener("load", () => {
  syncButtonState();
  connectWallet(true);
});
