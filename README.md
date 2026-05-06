# 🖼️ NFT Marketplace — Internet Computer (ICP)

A fully decentralized NFT Marketplace built on the **Dfinity Internet Computer Protocol (ICP)** blockchain using **Motoko** smart contracts and a **React** frontend. Users can mint NFTs, list them for sale, discover collections, and purchase NFTs — all settled on-chain using an ICP-native token.

---

## 🔗 Live Demo

> Deploy locally using the steps below. Mainnet deployment requires ICP tokens for cycles.

---

## 🧱 Tech Stack

| Layer | Technology |
|---|---|
| Blockchain | [Internet Computer Protocol (ICP)](https://internetcomputer.org) |
| Smart Contracts | [Motoko](https://internetcomputer.org/docs/current/motoko/main/motoko) |
| CLI / Deployment | [DFX SDK](https://internetcomputer.org/docs/current/developer-docs/setup/install/) |
| Frontend | React.js, React Router, React Hooks |
| Styling | CSS3 |
| Token | ICP-native fungible token (custom canister) |

---

## 📋 Table of Contents

- [Overview](#-overview)
- [Architecture](#-architecture)
- [Prerequisites](#-prerequisites)
- [Getting Started](#-getting-started)
- [Project Structure](#-project-structure)
- [Smart Contracts (Canisters)](#-smart-contracts-canisters)
- [DFX Configuration](#-dfx-configuration)
- [Key Commands](#-key-commands)
- [Minting an NFT via CLI](#-minting-an-nft-via-cli)
- [How It Works](#-how-it-works)
- [License](#-license)

---

## 🌐 Overview

This project demonstrates a fully on-chain NFT ecosystem on the **Internet Computer**. Unlike Ethereum-based marketplaces where only contract logic lives on-chain, ICP hosts **both the frontend and backend** as canisters — making the entire dApp truly decentralized with no external hosting required.

**Core features:**
- 🪙 Mint NFTs with custom name and image data
- 🏪 List minted NFTs on the marketplace with a set price
- 🔍 Discover NFTs listed by other users
- 💸 Buy NFTs using the on-chain token wallet
- 🔐 Ownership transfer handled fully by smart contract logic

---

## 🏗️ Architecture

```
┌──────────────────────────────────────────────────────┐
│                 Internet Computer                    │
│                                                      │
│  ┌────────────┐   ┌────────────┐   ┌─────────────┐  │
│  │  NFT       │   │ Marketplace│   │  Token      │  │
│  │  Canister  │◄──│  Canister  │◄──│  Canister   │  │
│  │ (Motoko)   │   │  (Motoko)  │   │  (Motoko)   │  │
│  └────────────┘   └────────────┘   └─────────────┘  │
│         ▲                ▲                           │
│         │                │                           │
│  ┌──────────────────────────────┐                    │
│  │     Frontend Canister        │                    │
│  │     (React / Assets)         │                    │
│  └──────────────────────────────┘                    │
└──────────────────────────────────────────────────────┘
```

All canisters communicate via **inter-canister calls** — no external API or backend server required.

---

## ✅ Prerequisites

Before running the project, ensure you have the following installed:

**1. DFX SDK** (Dfinity's Internet Computer SDK)
```bash
sh -ci "$(curl -fsSL https://sdk.dfinity.org/install.sh)"
```
Verify:
```bash
dfx --version
```

**2. Node.js** (v16 or higher recommended)
```bash
node --version
npm --version
```

**3. WSL / macOS / Linux**
> DFX does not natively support Windows. Use WSL2 on Windows.

---

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/SGoD11/NFT-Market-Place.git
cd NFT-Market-Place
```

### 2. Install Frontend Dependencies

```bash
npm install
```

### 3. Start the Local ICP Replica

```bash
dfx start --clean --background
```

> `--clean` resets all local canister state. Remove it if you want to preserve state between sessions.

### 4. Deploy All Canisters

```bash
dfx deploy
```

This compiles Motoko contracts, deploys all canisters to your local replica, and generates the JavaScript declaration files automatically.

### 5. Start the Frontend Dev Server

```bash
npm start
```

Open [http://localhost:8080](http://localhost:8080) in your browser.

---

## 📁 Project Structure

```
NFT-Market-Place/
│
├── dfx.json                    # Canister configuration (ICP project manifest)
├── package.json                # Node dependencies & npm scripts
├── webpack.config.js           # Webpack bundler config for frontend
│
├── src/
│   ├── nft/                    # NFT Canister (Motoko)
│   │   └── nft.mo              # NFT smart contract — minting & ownership
│   │
│   ├── opend/                  # Marketplace Canister (Motoko)
│   │   └── opend.mo            # Core marketplace logic — listing & buying
│   │
│   ├── token/                  # Token Canister (Motoko)
│   │   └── token.mo            # Fungible token — balances & transfers
│   │
│   ├── opend_assets/           # Frontend Canister
│   │   └── src/
│   │       ├── index.html      # Entry HTML
│   │       ├── index.js        # React entry point
│   │       └── components/     # React components
│   │           ├── App.jsx
│   │           ├── Item.jsx     # Individual NFT display card
│   │           ├── Minter.jsx   # NFT minting interface
│   │           └── ...
│   │
│   └── declarations/           # Auto-generated JS bindings (do not edit)
│       ├── nft/
│       ├── opend/
│       └── token/
│
└── .dfx/                       # Local replica state (auto-generated, git-ignored)
```

---

## 📜 Smart Contracts (Canisters)

### 1. `nft.mo` — NFT Canister

Each NFT is its own **canister** on ICP (unlike Ethereum where all tokens share one contract). This canister manages:

- `owner` — Principal ID of the current owner
- `imageData` — Raw binary image data stored fully on-chain
- `name` — Display name of the NFT
- `getOwner()` — Returns current owner principal
- `transferOwnership(newOwner, isListed)` — Transfers NFT to a new principal
- `isListed()` — Returns whether the NFT is listed for sale

```motoko
// Example: Transfer ownership to marketplace canister
public shared({ caller }) func transferOwnership(newOwner: Principal, isListed: Bool) : async Text {
    if (caller == owner) {
        owner := newOwner;
        listed := isListed;
        return "Success";
    } else {
        return "Error: Not Authorized";
    };
};
```

---

### 2. `opend.mo` — Marketplace Canister

The core marketplace logic. It maintains:

- `mapOfNFTs` — HashMap mapping NFT canister IDs to owner principals
- `mapOfListings` — HashMap of listed NFTs and their prices
- `mint(imgData)` — Dynamically creates a new NFT canister
- `list(id, price)` — Lists an NFT for sale at a given price
- `getListings()` — Returns all currently listed NFTs
- `completePurchase(id, ownerId, buyerId)` — Executes a token transfer and ownership handover

```motoko
// Example: Listing an NFT
public shared({ caller }) func list(id: Principal, price: Nat) : async Text {
    mapOfListings.put(id, price);
    let nft = actor(Principal.toText(id)) : actor { transferOwnership : (Principal, Bool) -> async Text };
    let result = await nft.transferOwnership(Principal.fromActor(OpenD), true);
    return result;
};
```

---

### 3. `token.mo` — Token Canister

A custom ICP-native fungible token used as marketplace currency. Manages:

- `balanceOf(who)` — Returns token balance for a principal
- `transfer(to, amount)` — Sends tokens between principals
- `faucet()` — (Testnet) Drip free tokens to callers for testing

---

## ⚙️ DFX Configuration

`dfx.json` is the project manifest — it defines all canisters, their types, source paths, and dependencies.

```json
{
  "canisters": {
    "opend": {
      "main": "src/opend/opend.mo",
      "type": "motoko"
    },
    "nft": {
      "main": "src/nft/nft.mo",
      "type": "motoko"
    },
    "token": {
      "main": "src/token/token.mo",
      "type": "motoko"
    },
    "opend_assets": {
      "dependencies": ["opend", "token"],
      "frontend": {
        "entrypoint": "src/opend_assets/src/index.html"
      },
      "source": ["src/opend_assets/assets", "dist/opend_assets/"],
      "type": "assets"
    }
  },
  "defaults": {
    "build": {
      "packtool": ""
    }
  },
  "networks": {
    "local": {
      "bind": "127.0.0.1:8000",
      "type": "ephemeral"
    }
  },
  "version": 1
}
```

> `"type": "motoko"` — tells DFX to compile the `.mo` file using the Motoko compiler.  
> `"type": "assets"` — tells DFX to serve the React frontend as a static asset canister.

---

## 🔑 Key Commands

| Command | Description |
|---|---|
| `dfx start --clean --background` | Start fresh local ICP replica |
| `dfx deploy` | Compile & deploy all canisters |
| `dfx deploy <canister_name>` | Deploy a specific canister only |
| `dfx canister status <name>` | Check running status of a canister |
| `dfx canister id <name>` | Get canister Principal ID |
| `dfx identity get-principal` | Get your own Principal ID |
| `dfx stop` | Stop the local replica |

---

## 🧪 Minting an NFT via CLI

You can mint an NFT directly through the command line (useful for testing without the UI):

**Step 1 — Deploy the NFT canister with arguments:**
```bash
dfx deploy nft --argument='(
  "CryptoDunks #001",
  principal "<YOUR_PRINCIPAL_ID>",
  (vec { 137; 80; 78; 71; ... })
)'
```
> The `vec { ... }` is the raw PNG binary data of your image.

**Step 2 — Register the NFT with the marketplace:**
```bash
dfx canister call opend mint '(vec { 137; 80; 78; 71; ... })'
```

**Step 3 — Transfer ownership to the marketplace for listing:**
```bash
dfx canister call <NFT_CANISTER_ID> transferOwnership '(
  principal "<OPEND_CANISTER_ID>",
  true
)'
```

Get your canister IDs with:
```bash
dfx canister id opend
dfx canister id nft
```

---

## 🔄 How It Works

```
User mints NFT
      │
      ▼
opend.mint() creates a new NFT canister on-chain
      │
      ▼
NFT is stored in mapOfNFTs with caller as owner
      │
      ▼
User lists NFT → opend.list(canisterId, price)
      │
      ├── NFT.transferOwnership(opendCanister, true)
      └── Price saved in mapOfListings
            │
            ▼
      Buyer discovers NFT on /discover page
            │
            ▼
      Buyer approves token transfer to opend
            │
            ▼
      opend.completePurchase() is called
            ├── token.transfer(seller, price)
            └── NFT.transferOwnership(buyer, false)
```

---

## 📦 `package.json` — Key Dependencies

```json
{
  "dependencies": {
    "@dfinity/agent":    "ICP agent library — makes calls to canisters from JS",
    "@dfinity/candid":   "Candid interface description language support",
    "@dfinity/principal":"Principal ID type handling",
    "react":             "Frontend UI library",
    "react-dom":         "React DOM renderer",
    "react-router-dom":  "Client-side routing"
  },
  "devDependencies": {
    "webpack":           "Bundles frontend assets",
    "webpack-cli":       "Webpack CLI runner",
    "html-webpack-plugin":"Injects bundle into HTML template",
    "copy-webpack-plugin":"Copies static assets to dist/"
  }
}
```

> The `@dfinity/*` packages are the official JavaScript/TypeScript agent libraries for interacting with ICP canisters from the browser.

---

## 🌍 Deploying to ICP Mainnet

To deploy to the live Internet Computer network, you need **ICP tokens converted to Cycles** (ICP's gas equivalent).

```bash
# Deploy to mainnet
dfx deploy --network ic
```

Your frontend will be accessible at:
```
https://<opend_assets_canister_id>.ic0.app
```

---

## 🤝 Contributing

Contributions are welcome. Please open an issue or submit a pull request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/your-feature`)
3. Commit your changes (`git commit -m 'Add feature'`)
4. Push to the branch (`git push origin feature/your-feature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the **CCO License** — see [LICENSE](LICENSE) for details.

---
