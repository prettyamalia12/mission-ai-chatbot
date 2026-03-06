// Rewards catalog derived from production data.
// Injected into the system prompt to help AVA identify correct reward types, names, and SetItemIds.

export const REWARDS_CATALOG = `## Rewards Catalog

When configuring a reward, always ask:
1. What type of reward? (Token, NFT, Consumable, Physical Item, Booster Pack)
2. Which specific reward? (token symbol or NFT/item name)
3. How many / what amount?

Use the catalog below to identify the correct reward name and SetItemId.

---

## Reward Types & Sending Flows

| Type | Identifier | Sending Flow | Reward Title Text |
|---|---|---|---|
| Token | Symbol (e.g. FDS) | Automatic (FDW Wallet) | "You have received" |
| NFT | SetItemId (e.g. ITMTYM000001) | Automatic (FDW Wallet) | "You have received" |
| Consumable | SetItemId (e.g. IC_POTION_HEALTH) | Automatic (FDW Wallet) | "You have received" |
| Booster Pack | SetItemId (e.g. BOOSTER_PACK_001) | Automatic (FDW Wallet) | "You have received" |
| Physical Item | SetItemId (e.g. LDG001) | Manual - Physical Item (Contact CS) | "Chance to win" |
| USDT / BTC / THB / Trump | Symbol | Manual (BTZ TH Wallet) | "You will receive" |

**Manual rewards note:** USDT, BTC, THB, Trump tokens are airdropped to Bitazza Thailand app within 14 business days after the campaign ends.
**Physical Item note:** Winner is contacted by CS team. Always use "Chance to win" format for these rewards.

---

## Tokens (by community)

| Symbol | Full Name | Community |
|---|---|---|
| FDS | Freedom Shards | All communities |
| FDM | Freedom Token | All communities |
| TYM | TomYumThai Points | Tom Yum Thai |
| BED | Bored Town Points | Bored Town |
| WEECO | WEECO Points | We Eco |
| FFF | Freedom Fantasy Football Points | Freedom Fantasy Football |
| RSC | Rosie Master Points | Rosie Master |
| SPK | Fuse Sparks | FUSE |
| BUF | Baan Unrak Foundation Points | Baan Unrak Foundation |
| AREA | Area Five Points | Area Five |
| TGT | Topgolf Thailand Points | Topgolf |
| CRN | Cherean Points | Cherean |
| ONYX | ONYX Points | ONYX |
| SYN | SSTown Points | SSTown |
| SONG | Songkhla Points | Songkhla |
| PRANG | Prang View Points | Prang View |
| WAFF | Ratio/Prang View Points | Prang View / Ratio Waffle |
| ZENY | Tochio ZENY Points | Tochio Donut |
| RICOS | Rico's Sathorn Points | Rico's Sathorn |
| BAKED | Baked By Apple Points | Baked By Apple |
| CNNT | Tech & Trade Points | Tech & Trade community Thailand |
| RINN | RiNn Thai Tea Points | RiNn Refined Thai Tea |
| VSTRT | V Street Points | V Street |
| YUU | Yuutako Points | Yuutako |
| CNFT | Conserve Natural Forest Points | Conserve Natural Forest |
| DRMF | Dog Rescue Mae Phim Points | Dog Rescue Mae Phim Foundation |
| PUP | Adoptable Puppy Cafe Points | The Adoptable Puppy Cafe and Thai Dogs Matter |
| GOH | Gift of Happiness Points | Gift of Happiness |
| USDT | Tether Stablecoin | Tether / Bitazza TH / Freedom Card |
| BTC | Bitcoin | Bitazza TH |
| THB | Thai Baht | Bitazza TH |
| Trump | Trump Token | Bitazza TH |

### The Scape — Crafting Materials (Tokens)
| Symbol | Material Name |
|---|---|
| OBS | Obsidian |
| ATHS | Aetherstone |
| CRM | Ceramite |
| DRS | Durasteel |
| ADMT | Adamantium |
| VSA | Voidsteel Alloy |
| NCC | Nano-Circuits |
| NRFM | Neurofiber Mesh |
| QTPC | Quantum Processor Chip |
| BIOG | Bio-Gel |
| PMF | Plasmic Fluid |
| BSTR | Biosynthetic Resin |
| INCT | Incubator Tube |

---

## NFTs — Food & Vouchers

| SetItemId | Name | Community |
|---|---|---|
| ITMTYM000001 | Cha Khong - Small Bottle (Thai Tea) | Tom Yum Thai |
| ITMTYM000002 | Cha Khong - Big Bottle (Thai Tea) | Tom Yum Thai |
| (no SetItemId) | Oliang | Tom Yum Thai |
| ITMBZD000001 | Free Tasting Ticket | Boozia |
| ITMBZD000002 | Special Discount on Wine (20%) | Boozia |
| ITMSEEN000016 | French Fries | Seen Space |
| ITMSEEN000017 | Budweiser Bottle | Seen Space |
| ITMSEEN000018 | Pint of Singha | Seen Space |
| (no SetItemId) | Free Frontera Chardonnay Voucher | Seen Space |
| (no SetItemId) | Free Frontera Cabernet Sauvignon Voucher | Seen Space |
| ITMROSIE000001 | Rosie Master Beauty Pass (free clinic service) | Rosie Master |
| ITMAFC000001 | Smoothies (Variety of Flavors) | Area Five |
| ITMAFC000002 | The Scape Monster - Harpy Featherling T-shirt | Area Five |
| ITMBKD000001 | 250 THB Voucher at BangBang | Bangkok Deejay |
| ITMBKD000002 | 500 THB Voucher at BangBang | Bangkok Deejay |
| ITMBKD000003 | 750 THB Voucher at BangBang | Bangkok Deejay |
| ITMSGK000001 | Songkhla Cold Cup | Songkhla |
| ITMRTW000002 | Two-tone Waffle (1 ea) | Ratio Waffle |
| ITMRTW000004 | FREE Ratio Roll worth 20 THB | Ratio Waffle |
| ITMRTW000005 | FREE Ratio Roll Special Set worth 100 THB | Ratio Waffle |
| ITMTCD000001 | Yogurt (blueberry or strawberry) | Tochio Donut |
| ITMTCD000002 | 1 box (4 pcs) Classic Donuts | Tochio Donut |
| ITMAJP000001 | Free Blessed Miniature Sacred Gold Charm | ANant Ja Pan ChaYen |
| ITMAJP000002 | Free 1 Glass of Ice Thai Tea | ANant Ja Pan ChaYen |
| ITMAJP000003 | Free Caramel Butter Toast | ANant Ja Pan ChaYen |
| ITMAJP000004 | Free Thai Tea + Sweet Corn with Butter | ANant Ja Pan ChaYen |
| ITMRST000001 | Enjoy 1 Free Cookie | Rico's Sathorn |
| (no SetItemId) | Free 1 Original Curry Puff | Baked By Apple |
| ITMRRT000001 | Free Any 1 Drink from RiNn Thai Tea (up to 125 THB) | RiNn Refined Thai Tea |
| ITMYTK000001 | Free Miso Soup | Yuutako |
| ITMYTK000002 | Free Takoyaki Size S (1 box) | Yuutako |
| ITMYTK000003 | FREE Okonomiyaki (99 THB) | Yuutako |
| (no SetItemId) | Free 1 Glass of Thai Tea + Sweet Corn | ANant Ja Pan ChaYen |

---

## NFTs — The Scape Wearables

| SetItemId | Name |
|---|---|
| CSCAPE000001_WSCAPE000001 | Rugged Explorer Helm |
| CSCAPE000001_WSCAPE000002 | Rugged Explorer Chestplate |
| CSCAPE000001_WSCAPE000003 | Rugged Explorer Cloak |
| CSCAPE000001_WSCAPE000004 | Rugged Explorer Gloves |
| CSCAPE000001_WSCAPE000005 | Rugged Explorer Pants |
| CSCAPE000001_WSCAPE000006 | Rugged Explorer Boots |
| CSCAPE000001_WSCAPE000007 | Standard-issue Blaster |
| CSCAPE000001_WSCAPE000008 | Rugged Explorer Pack |
| EPICS_CSCAPE000001_WSCAPE000002 | Pendant of the Seraph (Epic) |

---

## Consumables — The Scape (in-game items)

| SetItemId | Name | Effect |
|---|---|---|
| IC_POTION_HEALTH | Potion of Health | Restores 50 HP |
| IC_POTION_EXTRA_HEALTH | Potion of Extra Health | Restores 80 HP |
| IC_DIMENSION_GENERATOR | Dimension Generator | Resets monsters in area |
| IC_GREATER_DIMENSION_GENERATOR | Greater Dimension Generator | Enhanced monster reset |
| IC_MEGA_DIMENSION_GENERATOR | Mega Dimension Generator | Opens doorway for more monsters |
| IC_MOODERLING_LURE | Mooderling Lure | Attracts Mooderlings |

---

## Booster Packs — The Scape

| SetItemId | Name | Contents |
|---|---|---|
| BOOSTER_PACK_001 | The Dominion War Booster Pack | 4 random cards (Common + Uncommon guaranteed, chance for Rare/Epic/Alt Art) |

---

## Physical Items

| SetItemId | Name | Community | Delivery |
|---|---|---|---|
| LDG001 | Ledger Flex Hardware Wallet | Bitazza TH | Manual - Contact CS |
| LDG002 | Ledger Stax Hardware Wallet | Bitazza TH | Manual - Contact CS |
| TCGKEY001 | The Scape Soulgazer Keychain Limited Edition | The Scape | Manual - Contact CS |

---

## Notes for AVA

- If user asks for a reward not in this catalog, ask them for the SetItemId or token symbol.
- For NFTs with no SetItemId listed above, ask the user to confirm the SetItemId before finalizing.
- FDS and FDM work for any community (ecosystem-wide rewards).
- Physical Items and Bitazza tokens (USDT/BTC/THB/Trump) require manual distribution — inform the user the reward will NOT be sent automatically.
- The Scape Harpy Featherling T-shirt (ITMAFC000002) is a physical item disguised as an NFT — delivery is manual (Contact CS), reward format is "Chance to win".
`
