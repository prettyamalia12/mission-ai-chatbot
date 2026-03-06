// Metric naming conventions and reference examples derived from production data.
// This is injected into the system prompt to help AVA suggest correct metric names and configs.

export const METRICS_CATALOG = `## Existing Metrics Reference

These are real metric naming patterns and configurations used in production.
Follow these naming conventions and property patterns when suggesting new metrics.

### Naming Convention
Format: {event-action}-{community-or-context}
- lowercase, dash-separated
- include community name at the end
- describe the action clearly
- append -v2, -v3 for versioned variants

---

## Merchant / Freedom / Bitazza / Freedom Card Metrics

### Token Purchased (no filter, just counts any top-up)
metric: token-purchased
Event: Token Purchased | No filter | No increment

### Token Purchased (THB amount, all communities)
metric: token-purchased-amount-thb
Event: Token Purchased | props: product=thb, topup_amount=amount | increment: topup_amount

### Token Purchased (THB amount, specific community)
metric: token-purchased-amount-thb-{community-name}
Event: Token Purchased | props: product=thb, topup_amount=amount, community_name={community} | increment: topup_amount

### FDW Email Verified
metric: fdw-email-verified
Event: FDW Email Verified | No filter | No increment | threshold: 1

### FDW Signed In
metric: fdw-signed-in
Event: FDW Signed In | No filter | No increment | threshold: 1

### FDW Signed Up
metric: fdw-signed-up
Event: FDW Signed Up | No filter | No increment | threshold: 1

### Community Joined (any community)
metric: community-joined
Event: Community Joined | No filter | No increment | threshold: 1

### Community Joined (specific community)
metric: community-joined-{community-name}
Event: Community Joined | props: community_id={id} OR community_name={name} | No increment | threshold: 1

### Freedom Card Onboarded
metric: card-onboarded
Event: Card Onboarded | No filter | No increment | threshold: 1

### Freedom Card Topped Up (any amount)
metric: card-topped-up
Event: Card Topped Up | No filter | No increment

### Freedom Card Topped Up (THB amount)
metric: card-topped-up-amount-thb
Event: Card Topped Up | props: amount=amount, product=thb | increment: amount

### Freedom Card Spent (any amount)
metric: card-spent-amount
Event: Card Spent | props: amount=amount | increment: amount

### Freedom Card Spent (specific merchant)
metric: card-spent-amount-{merchant-name}
Event: Card Spent | props: amount=amount, merchant={merchant name} | increment: amount

### Fdp Payment Completed (spending, specific community, exclude non-mission merchants)
metric: spending-missions-{community-name}
Event: Fdp Payment Completed | props: merchant_name not equals {community name} | increment: order_amount
Note: Use "not equals" to exclude the community's own top-up payments when tracking spending only.

### Item Purchased (specific community)
metric: item-purchased-{community-name}
Event: Item Purchased | props: community_id={id} | increment: quantity

### Item Purchased (specific merchandise)
metric: item-purchased-{item-description}-{community-name}
Event: Item Purchased | props: community_id={id}, merchandise_id={id1}, merchandise_id={id2} | increment: quantity

---

## The Scape Game Metrics (community_id: 711 PROD, Adventure LN Hub STG)

### First time played
metric: first-time-played-the-scape
Event: Game Match Resulted | No filter | No increment | threshold: 1

### Defeat monsters (total kills)
metric: defeat-monster-the-scape
Event: Game Match Resulted | props: monster_killed_total=amount | increment: monster_killed_total

### Defeat specific monster
metric: defeat-monster-{monster-name}-the-scape
Event: Game Match Resulted | props: monster_killed_{monster_id}=amount | increment: monster_killed_{monster_id}
Known monster IDs (partial list, more may exist): blob, WRAITH, GHAJAR, shard_gobbler, scape_harpy, dominion_scout, dominion_lancer, naidu_puppeteer, naidu_acolyte, SOULGAZER, ghajar_abductor, harpy_skyclaw, gobbler_abomination, protectorate_knight, MEGABLOB, SOULSTARER, SPECTER, SYNDICATE_ASSASSIN, AESIR_MOOD_ENGINEER, GARRO_DOMINION_CAPTAIN, PROTECTORATE_TEMPLAR

### Defeat monsters and win (win-only variant)
metric: defeat-monster-the-scape-v2
Event: Game Match Resulted | props: monster_killed_total=amount, match_result=Win | increment: monster_killed_total

### Win matches
metric: win-games-the-scape
Event: Game Match Resulted | props: match_result=Win | No increment | threshold: X wins

### Reach player level X
metric: reach-level-{X}-the-scape
Event: Game Match Resulted | props: player_level >= {X} (Greater Than Or Equal) | No increment | threshold: 1

### Collect specific material
metric: {material-name}-materials-collected-the-scape
Event: Game Match Resulted | props: received_materials_{TYPE}=amount | increment: received_materials_{TYPE}
Known material types: BIOG (bio), DRS (durasteel), OBS (obsidian), NCC (nanocircuits), ADMT, ATHS, BSTR, CRM, FDS, NNC, NRFM, PMF, QTPC, VSA

### Equip new skin
metric: new-skin-equipped-the-scape
Event: Avatar Skin Changed | props: is_default_string=false | No increment | threshold: 1

### Equip wearable (boots, gear, guns, accessories)
metric: wearable-equipped-the-scape
Event: Avatar Wearable Equipped | filter by wearable_type if specific item | No increment | threshold: 1

### Buy skin (item purchase)
metric: item-purchased-{skin-name}-the-scape
Event: Item Purchased | props: community_id=711, merchandise_id={id} | No increment | threshold: 1
Note: Ask user for merchandise_id(s) — multiple merchandise_id filters use OR logic.

### Join The Scape community
metric: community-joined-the-scape
Event: Community Joined | props: community_id=711 | No increment | threshold: 1

### Spending missions (not top-up, actual spend)
metric: spending-missions-the-scape
Event: Fdp Payment Completed | props: merchant_name not equals The Scape | increment: order_amount

### Referral missions (invite friends)
metric: referral-{mission-description}-{community-name}
Event: Referral Claim Completed | props: community_id={community_id} | No increment
Note: Use the exact community_id for the community this mission belongs to.

### Complete Rift (specific rift type)
metric: complete-{rift-name}-rift
Event: Game Match Resulted | props: is_rifts_mode=true, monster_master_id={id}, match_result=Win | No increment | threshold: 1

### Complete Nexus
metric: complete-nexus-rift
Event: Game Match Resulted | props: is_nexus=true, match_result=Win | No increment | threshold: 1

---

## Freedom Planets Game Metrics (community_id: 177 PROD)

### Discover / buy first planet
metric: discover-first-planet
Event: Item Purchased | props: merchandise_type=planet, community_id=177 | No increment | threshold: 1

### Activate first planet
metric: activate-first-planet
Event: Planet Activated | No filter | No increment | threshold: 1

### Build specific structure
metric: build-{structure-name}-planet
Event: Planet Structure Built | props: structure_name={exact structure name} | No increment | threshold: 1
Example: build-genetic-modification-lab-planet → structure_name=Genetic Modifications Lab

### Assign food workers (milestone-style: multiple levels)
metric: assign-food-worker-planet
Event: Planet Workforce Updated | props: food_workforce=1, food_workforce=2, ... (one per milestone level) | No increment
Note: Multiple property values with the same property name create OR conditions per level threshold.

### Assign industrial workers (milestone-style: multiple levels)
metric: assign-industrial-worker-planet
Event: Planet Workforce Updated | props: industrial_workforce=1, industrial_workforce=2, ... (one per milestone level) | No increment

`
