import { CATEGORIES, type CategoryId, type DiyVerdict, type Severity } from "@/lib/diagnosis-meta";

/**
 * Evergreen problem guides. Each one leads with a direct answer, then the
 * structure a homeowner (or an AI answer engine) needs: causes and how to tell
 * them apart, what's safe to try, when to stop, costs, and what to say to a pro.
 *
 * Prices are ballpark US ranges. Keep `reviewed` current when they change.
 */

export type Guide = {
  slug: string;
  /** On-page H1. */
  title: string;
  /** <title>, written for the search result. */
  metaTitle: string;
  metaDescription: string;
  /** Short name used in cards and breadcrumbs. */
  symptom: string;
  /** Prefills the category chip on /diagnose. */
  category?: CategoryId;
  reviewed: string;
  quickAnswer: string;
  severity: Severity;
  severityNote: string;
  verdict: DiyVerdict;
  verdictNote: string;
  /** "Stop and call a pro now" conditions. Shown above everything else. */
  safety?: string[];
  causes: { cause: string; howToTell: string; fix: string }[];
  tryFirst: string[];
  callAPro: string[];
  costs: { job: string; diy: string; pro: string }[];
  tellThePro: string;
  faqs: { q: string; a: string }[];
};

export const GUIDES: Guide[] = [
  {
    slug: "water-heater-leaking",
    title: "Water heater leaking: what it means and what to do",
    metaTitle: "Water Heater Leaking? Causes, Urgency and Repair Costs",
    metaDescription:
      "Find where your water heater is leaking from, whether it's a $20 valve or a failing tank, what's safe to do now, and what a plumber should charge.",
    symptom: "Water heater leaking",
    category: "plumbing",
    reviewed: "2026-09-27",
    quickAnswer:
      "Most water heater leaks come from one of four places: the temperature-and-pressure (T&P) relief valve, the drain valve near the bottom, the pipe connections on top, or the tank itself. Leaks from valves and fittings are usually fixable with a part under $50. Water coming from the tank body means it has rusted through and needs replacing, typically $1,200 to $3,500 installed for a standard 40 to 50 gallon tank.",
    severity: "urgent",
    severityNote:
      "A slow drip from a fitting can wait a day or two if you catch the water. A leak from the tank itself only gets worse and can let go suddenly.",
    verdict: "diy_if_handy",
    verdictNote:
      "Tightening fittings and swapping a drain valve or supply connector are handy-homeowner jobs. Replacing the tank usually needs a permit and a plumber.",
    safety: [
      "Gas heater and you smell rotten eggs: leave the house and call your gas utility from outside.",
      "Water pooling near the electrical connections of an electric heater: switch off its breaker before you touch anything.",
      "The T&P valve is blowing hot water or steam: stay clear, shut off the power or gas, and call a plumber. The tank may be overheating.",
    ],
    causes: [
      {
        cause: "T&P relief valve",
        howToTell: "Water runs from the discharge pipe on the side of the tank, or the valve itself is wet.",
        fix: "An occasional drip can mean the valve is worn. Frequent discharge means pressure or temperature is too high, often from high street pressure or a missing expansion tank.",
      },
      {
        cause: "Drain valve",
        howToTell: "Drips from the hose spigot near the bottom of the tank.",
        fix: "Snug it closed and add a hose cap. If it still drips, replace the valve.",
      },
      {
        cause: "Loose connections on top",
        howToTell: "Water on top of the tank or running down from the hot or cold pipes.",
        fix: "Tighten the fittings. Replace corroded flex connectors.",
      },
      {
        cause: "Condensation",
        howToTell: "A little water under a gas heater, mostly after a lot of hot water use or when first filled. It stops once the tank is hot.",
        fix: "Nothing to fix if it stays small and stops. Keep watching it.",
      },
      {
        cause: "Tank corrosion",
        howToTell: "Water seeps from under the jacket or the bottom of the tank, sometimes with rusty water. Often in tanks 8 to 12 or more years old.",
        fix: "The tank can't be repaired. Plan a replacement.",
      },
    ],
    tryFirst: [
      "Dry everything with a towel, then watch for 10 minutes to see where water appears first.",
      "Turn off the cold-water supply valve on the pipe going into the heater.",
      "Turn off the breaker (electric) or set the gas control to Off or Pilot (gas).",
      "Put a drain pan or towels down, and check the label for the tank's age.",
    ],
    callAPro: [
      "Water is coming from the tank itself.",
      "The T&P valve keeps discharging.",
      "You can't find the source of the leak.",
      "Any gas smell, scorching or water near wiring.",
    ],
    costs: [
      { job: "Replace T&P relief valve", diy: "$20–$40", pro: "$150–$350" },
      { job: "Replace drain valve", diy: "$10–$25", pro: "$100–$250" },
      { job: "Replace supply connectors", diy: "$10–$30", pro: "$100–$250" },
      { job: "Add a thermal expansion tank", diy: "$40–$80", pro: "$200–$450" },
      { job: "Replace a 40–50 gal tank water heater", diy: "Not recommended", pro: "$1,200–$3,500" },
    ],
    tellThePro:
      "My [gas / electric] tank water heater, about [age] years old, is leaking from [the top fittings / the relief valve / the drain valve / under the tank]. I've shut off the cold supply and the [breaker / gas]. Can the valve or fitting be replaced, or is the tank failing? If it needs replacing, does your price include the permit, haul-away and any code updates like an expansion tank?",
    faqs: [
      {
        q: "Is a leaking water heater an emergency?",
        a: "Not always, but don't ignore it. A drip from a fitting or valve can usually wait a day or two if you catch the water. A leak from the tank itself means it's failing, so shut off the cold supply and the power or gas and get it replaced soon.",
      },
      {
        q: "Can I keep using a leaking water heater?",
        a: "If the leak is a small drip from a top fitting or the drain valve, usually yes, for a short time while you fix it. If the tank itself is leaking, shut it down. A rusted-through tank can fail and flood.",
      },
      {
        q: "Why is water coming out of the pressure relief valve?",
        a: "The valve opens when tank pressure or temperature gets too high, or when it's worn out. Common causes are the thermostat set too high, high water pressure from the street, or a missing or failed expansion tank. A valve that discharges more than once needs a plumber to look at it.",
      },
      {
        q: "How long does a tank water heater last?",
        a: "Typically 8 to 12 years. Hard water and skipping the yearly flush shorten that.",
      },
    ],
  },
  {
    slug: "toilet-keeps-running",
    title: "Toilet keeps running: find the cause and fix it",
    metaTitle: "Toilet Keeps Running? The 5 Usual Causes and How to Fix Each",
    metaDescription:
      "A running toilet is almost always the flapper, the fill valve or the chain. How to tell which in five minutes, fix it for under $30, and when to call a plumber.",
    symptom: "Toilet keeps running",
    category: "plumbing",
    reviewed: "2026-09-27",
    quickAnswer:
      "A toilet that keeps running almost always has one of three problems inside the tank: a worn flapper that lets water leak into the bowl, a fill valve set too high so water spills into the overflow tube, or a lift chain that's too short or tangled. All three are DIY fixes with parts under $30 and 15 to 30 minutes of work. The EPA estimates a leaking toilet can waste about 200 gallons of water a day.",
    severity: "fix_soon",
    severityNote: "Not dangerous, but it wastes water and raises your bill every day it runs.",
    verdict: "diy",
    verdictNote: "No special tools. Shut off the valve behind the toilet, and bring the old part to the store to match it.",
    causes: [
      {
        cause: "Worn or warped flapper",
        howToTell:
          "The tank refills by itself every so often. Or add a few drops of food coloring to the tank: if color shows up in the bowl within 15 minutes without flushing, the flapper leaks.",
        fix: "Replace the flapper. Match the size (2 or 3 inch) and the brand if you can.",
      },
      {
        cause: "Fill valve set too high",
        howToTell: "The water level rises above the top of the overflow tube and trickles into it.",
        fix: "Lower the float so the water stops about 1 inch below the top of the overflow tube, or at the fill line.",
      },
      {
        cause: "Chain too short or tangled",
        howToTell: "The flapper doesn't sit flat after a flush.",
        fix: "Adjust the chain so there's about half an inch of slack.",
      },
      {
        cause: "Failing fill valve",
        howToTell: "Constant hissing, or the water won't shut off even when you lift the float by hand.",
        fix: "Replace the fill valve.",
      },
      {
        cause: "Cracked overflow tube or flush valve",
        howToTell: "Water keeps draining even with a new flapper and the level set correctly.",
        fix: "Replace the flush valve. It's a bigger job because the tank comes off the bowl.",
      },
    ],
    tryFirst: [
      "Take the tank lid off and watch one full flush and refill.",
      "Lift the float by hand. If the running stops, lower the float.",
      "Do the food-coloring test for the flapper.",
      "Check the chain slack.",
    ],
    callAPro: [
      "Water on the floor around the base (wax ring, or a cracked tank or bowl).",
      "The shutoff valve behind the toilet won't close or leaks itself.",
      "New parts don't fix it.",
    ],
    costs: [
      { job: "Replace flapper", diy: "$5–$15", pro: "$100–$200" },
      { job: "Replace fill valve", diy: "$10–$25", pro: "$125–$250" },
      { job: "Replace flush valve", diy: "$15–$40", pro: "$175–$350" },
      { job: "Replace the toilet (standard model)", diy: "$150–$400", pro: "$400–$1,000" },
    ],
    tellThePro:
      "My toilet keeps running. I've [replaced the flapper / adjusted the float / checked the chain] and it still [refills every few minutes / hisses constantly / drains into the overflow]. The shutoff valve [works / is stuck]. There [is / isn't] water on the floor at the base.",
    faqs: [
      {
        q: "How much water does a running toilet waste?",
        a: "A lot. The EPA estimates a leaking toilet can waste about 200 gallons a day, which shows up on your water bill fast.",
      },
      {
        q: "Is a running toilet an emergency?",
        a: "No. If you can't fix it right away, turn off the shutoff valve behind the toilet between uses.",
      },
      {
        q: "Why does my toilet run for a few seconds on its own?",
        a: "That's a phantom flush: water slowly leaks past the flapper until the fill valve tops the tank back up. A new flapper almost always fixes it.",
      },
    ],
  },
  {
    slug: "breaker-keeps-tripping",
    title: "Breaker keeps tripping: causes and when it's dangerous",
    metaTitle: "Circuit Breaker Keeps Tripping? Causes, Safety and Costs",
    metaDescription:
      "Why a breaker keeps tripping (overload, short, ground fault or a worn breaker), how to test it safely, the signs that mean stop, and what an electrician costs.",
    symptom: "Breaker keeps tripping",
    category: "electrical",
    reviewed: "2026-09-27",
    quickAnswer:
      "A breaker that trips is doing its job: cutting power before wiring overheats. The usual causes are an overloaded circuit, a short circuit, a ground fault, or an arc fault picked up by an AFCI breaker. If it only trips when a space heater, microwave or hair dryer is running, it's probably an overload you can fix by moving things to other circuits. If it trips the instant you reset it, smells hot, or shows scorch marks, stop resetting it and call an electrician.",
    severity: "urgent",
    severityNote:
      "Repeated tripping means something is wrong. It becomes 'stop and call a pro now' if you see scorch marks, smell burning, or the breaker trips instantly on reset.",
    verdict: "call_pro",
    verdictNote:
      "Testing for an overload is safe to do yourself. Anything inside the panel, the wiring or an outlet is a licensed electrician's job.",
    safety: [
      "Burning smell, scorch marks, or buzzing or crackling at the panel or an outlet: leave the breaker off and call an electrician.",
      "The breaker trips instantly every time you reset it: don't keep resetting it. That points to a short circuit.",
      "Water anywhere near the panel: don't touch it. Call an electrician.",
    ],
    causes: [
      {
        cause: "Overloaded circuit",
        howToTell:
          "Trips a few minutes after several high-draw things run together, like a space heater plus a microwave.",
        fix: "Move heavy appliances to other circuits. A room that always needs more may need a new dedicated circuit.",
      },
      {
        cause: "Short circuit",
        howToTell: "Trips immediately on reset, or the moment one particular device is plugged in. Sometimes a pop or scorch mark.",
        fix: "Unplug the device and don't use it. If it trips with everything unplugged, the problem is in the wiring.",
      },
      {
        cause: "Ground fault",
        howToTell: "A GFCI outlet or breaker in a kitchen, bath, garage or outdoors trips, often when things are wet.",
        fix: "Find the wet outlet or device. Persistent ground faults need an electrician.",
      },
      {
        cause: "Arc fault",
        howToTell: "An AFCI breaker trips seemingly at random, or with a specific appliance such as a vacuum.",
        fix: "Could be the appliance or a loose connection in the wiring. An electrician can tell which.",
      },
      {
        cause: "Worn breaker",
        howToTell: "An older breaker trips below its rated load, or feels warm.",
        fix: "An electrician replaces the breaker. Never swap in a larger size.",
      },
    ],
    tryFirst: [
      "Unplug everything on that circuit, then reset the breaker: push it firmly to Off, then On.",
      "If it holds, plug things back in one at a time to find the one that trips it.",
      "Note what was running when it tripped.",
      "Never tape or hold a breaker on, and never replace it with a bigger one.",
    ],
    callAPro: [
      "It trips with everything unplugged.",
      "Any burning smell, heat, buzzing or scorch marks.",
      "GFCI or AFCI trips you can't trace to one device.",
      "It keeps happening after you've spread the load out.",
    ],
    costs: [
      { job: "Electrician diagnostic visit", diy: "—", pro: "$100–$300" },
      { job: "Replace a standard breaker", diy: "Not recommended", pro: "$150–$350" },
      { job: "Replace an AFCI or GFCI breaker", diy: "Not recommended", pro: "$200–$450" },
      { job: "Add a dedicated 20-amp circuit", diy: "Not recommended", pro: "$300–$1,000" },
      { job: "Panel upgrade", diy: "Not recommended", pro: "$1,800–$5,000" },
    ],
    tellThePro:
      "The [kitchen / bedroom / bathroom] breaker trips [after a few minutes / immediately on reset / randomly]. It's a [standard / GFCI / AFCI] breaker. It happens when [these things] are running. With everything unplugged it [holds / still trips]. I [have / haven't] noticed a burning smell, heat or scorch marks.",
    faqs: [
      {
        q: "Is it safe to keep resetting a tripped breaker?",
        a: "Once or twice to test, yes. If it trips instantly, trips over and over, or you smell burning, leave it off and call an electrician.",
      },
      {
        q: "Can a breaker go bad?",
        a: "Yes. Breakers wear out and can start tripping below their rated load. An electrician can test it and replace it with the correct size.",
      },
      {
        q: "Why does my breaker trip when it rains?",
        a: "Usually a ground fault: water getting into an outdoor outlet, light fixture or damaged wiring. Keep that circuit off and have an electrician find the wet spot.",
      },
    ],
  },
  {
    slug: "ac-not-cooling",
    title: "AC running but not cooling: what to check before you call",
    metaTitle: "AC Running but Not Cooling? 5 Checks and Repair Costs",
    metaDescription:
      "AC blowing warm air? The checks you can do yourself (filter, thermostat, breaker, outdoor coil, ice), the repairs that need a tech, and typical costs.",
    symptom: "AC not cooling",
    category: "hvac",
    reviewed: "2026-09-27",
    quickAnswer:
      "When an AC runs but blows warm air, start with the cheap fixes: a clogged air filter, a thermostat set to Heat or Fan On, a tripped breaker for the outdoor unit, or a dirty, blocked outdoor coil. If those check out and the outdoor fan isn't spinning or the lines are iced over, you likely need a technician for a capacitor, a refrigerant leak or another part. A capacitor replacement typically runs $150 to $450, and a refrigerant leak repair $300 to $1,500 or more.",
    severity: "fix_soon",
    severityNote:
      "Urgent in extreme heat, especially with babies, older adults or anyone with a heat-sensitive medical condition in the house.",
    verdict: "diy_if_handy",
    verdictNote:
      "Filters, thermostat settings, breakers and rinsing the outdoor coil are DIY. Capacitors, refrigerant and compressors are for a licensed HVAC tech.",
    safety: [
      "Turn off the power at the outdoor disconnect before touching the outdoor unit. Don't open its electrical panel: capacitors hold a charge even with the power off.",
      "Burning smell from a vent or the outdoor unit: turn the system off at the thermostat and the breaker, and call a technician.",
    ],
    causes: [
      {
        cause: "Clogged air filter",
        howToTell: "Weak airflow from the vents. Sometimes ice on the indoor coil.",
        fix: "Replace the filter. Most need changing every 1 to 3 months in cooling season.",
      },
      {
        cause: "Thermostat settings",
        howToTell: "Set to Heat or Fan On, the setpoint is above room temperature, or the display is blank.",
        fix: "Set it to Cool and Auto, a few degrees below room temperature. Replace the batteries.",
      },
      {
        cause: "Outdoor unit has no power",
        howToTell: "The indoor blower runs but the outdoor unit is silent.",
        fix: "Check the AC breaker and the disconnect switch next to the outdoor unit.",
      },
      {
        cause: "Dirty or blocked outdoor coil",
        howToTell: "Leaves, grass, dryer lint or plants packed around the outdoor unit.",
        fix: "With the power off, clear 2 feet around it and rinse the fins gently with a garden hose. No pressure washer.",
      },
      {
        cause: "Frozen coil",
        howToTell: "Ice on the copper line at the outdoor unit or on the indoor coil.",
        fix: "Set the system to Off and the fan to On for a few hours to thaw. If it ices again, you need a technician.",
      },
      {
        cause: "Failed capacitor or contactor",
        howToTell: "The outdoor unit hums but its fan doesn't spin, or it clicks without starting.",
        fix: "A technician replaces the part, usually in one visit.",
      },
      {
        cause: "Low refrigerant from a leak",
        howToTell: "Long run times, ice on the lines, sometimes hissing.",
        fix: "A licensed tech finds and repairs the leak, then recharges. Refrigerant handling requires EPA certification.",
      },
    ],
    tryFirst: [
      "Set the thermostat to Cool and Auto, a few degrees below room temperature.",
      "Replace the air filter.",
      "Check the breaker and the outdoor disconnect.",
      "Clear 2 feet around the outdoor unit.",
      "If you see ice, turn cooling off and run the fan to thaw it before anything else.",
    ],
    callAPro: [
      "The outdoor fan doesn't spin, or the unit hums or clicks.",
      "Ice comes back after thawing.",
      "The breaker trips again.",
      "Any burning smell.",
    ],
    costs: [
      { job: "Replace air filter", diy: "$10–$40", pro: "—" },
      { job: "HVAC diagnostic visit", diy: "—", pro: "$75–$200" },
      { job: "Replace capacitor", diy: "Not recommended", pro: "$150–$450" },
      { job: "Replace contactor", diy: "Not recommended", pro: "$150–$400" },
      { job: "Replace outdoor fan motor", diy: "Not recommended", pro: "$300–$700" },
      { job: "Find and fix a refrigerant leak, then recharge", diy: "Not allowed", pro: "$300–$1,500+" },
    ],
    tellThePro:
      "My central AC runs but blows warm air. The indoor blower [runs / doesn't run], and the outdoor unit [is silent / hums / runs with the fan spinning]. I've replaced the filter and checked the thermostat and breakers. I [see / don't see] ice on the lines. The system is about [age] years old.",
    faqs: [
      {
        q: "Why is my AC running but not cooling the house?",
        a: "The most common causes are a clogged filter, wrong thermostat settings, a tripped breaker for the outdoor unit, or a dirty outdoor coil. If those are fine, a failed capacitor or a refrigerant leak is likely, and both need a technician.",
      },
      {
        q: "Can a dirty filter stop an AC from cooling?",
        a: "Yes. A clogged filter chokes airflow, which can freeze the indoor coil and stop cooling almost completely. Replacing it is the first thing to try.",
      },
      {
        q: "Should I keep running my AC if it's not cooling?",
        a: "No. If there's ice on the lines or the outdoor fan isn't spinning, running it can damage the compressor, the most expensive part. Turn cooling off until it's fixed.",
      },
    ],
  },
  {
    slug: "water-stain-on-ceiling",
    title: "Water stain on the ceiling: find the source before you paint",
    metaTitle: "Water Stain on the Ceiling? Causes, Urgency and Repair Costs",
    metaDescription:
      "A ceiling water stain comes from a roof leak, plumbing above, AC condensation or an old leak. How to tell which, when it's dangerous, and what repairs cost.",
    symptom: "Water stain on ceiling",
    reviewed: "2026-09-27",
    quickAnswer:
      "A ceiling water stain means water reached the drywall from above: a roof or flashing leak, a plumbing leak from a bathroom or pipe above, condensation from AC ducts or an attic unit, or an old leak that's already been fixed. When it shows up tells you which. After rain points to the roof. After showers or flushes points to plumbing. In hot, humid weather points to AC condensation. Painting over it without fixing the source just hides the next one.",
    severity: "fix_soon",
    severityNote:
      "Urgent if it's actively dripping, growing or near a light. 'Stop and call a pro now' if the ceiling sags or bulges.",
    verdict: "diy_if_handy",
    verdictNote:
      "Finding the source and repainting a dry stain are DIY. Roof repairs and hidden plumbing leaks are for a roofer or plumber.",
    safety: [
      "A sagging or bulging ceiling may be holding water and can collapse. Keep people out from under it and call a pro.",
      "Water near a light fixture or ceiling fan: switch that circuit off at the breaker.",
    ],
    causes: [
      {
        cause: "Roof or flashing leak",
        howToTell: "Appears or grows after rain, usually on the top floor or near a chimney, vent or skylight.",
        fix: "A roofer repairs the shingles or flashing. Then dry, prime and repaint.",
      },
      {
        cause: "Plumbing leak above",
        howToTell: "Under a bathroom or kitchen. Shows up after showers, baths or flushes.",
        fix: "Could be a drain, supply line, wax ring or failed grout and caulk. A plumber can pinpoint it.",
      },
      {
        cause: "AC condensation",
        howToTell: "In summer, near an attic air handler or ducts. A clogged condensate line or overflowing drain pan.",
        fix: "Clear the condensate line or fix the pan. Insulate sweating ducts.",
      },
      {
        cause: "Ice dams",
        howToTell: "In winter, near exterior walls and eaves in cold climates.",
        fix: "Short term, clear snow from the roof edge. Long term, attic insulation and ventilation.",
      },
      {
        cause: "Old, dry stain",
        howToTell: "The stain doesn't grow and the drywall is dry and firm.",
        fix: "Cosmetic. Seal with a stain-blocking primer, then paint.",
      },
    ],
    tryFirst: [
      "Press gently near the stain to feel if it's damp or soft. Don't push on a sagging area.",
      "Trace the stain's edge in pencil and check whether it grows.",
      "Note whether it changes after rain, showers or AC use.",
      "Look in the attic above with a flashlight, stepping only on the joists.",
      "Run the shower above for 10 minutes and watch the ceiling.",
    ],
    callAPro: [
      "The ceiling sags or bulges.",
      "The stain keeps growing.",
      "Water is near electrical fixtures.",
      "Mold covers more than about 10 square feet. The EPA suggests professional help at that size.",
    ],
    costs: [
      { job: "Stain-blocking primer and paint", diy: "$25–$60", pro: "$150–$400" },
      { job: "Patch and repaint damaged drywall", diy: "$30–$75", pro: "$250–$800" },
      { job: "Clear a clogged AC condensate line", diy: "$0–$20", pro: "$100–$250" },
      { job: "Repair an accessible plumbing leak", diy: "—", pro: "$150–$600" },
      { job: "Repair a roof leak", diy: "Not recommended", pro: "$400–$1,500" },
    ],
    tellThePro:
      "I have a water stain on my [top-floor / first-floor] ceiling, about [size], under [the roof / a bathroom / the attic air handler]. It [appeared after rain / grows after showers / shows up when the AC runs]. The drywall is [dry and firm / damp / soft or sagging]. I've [checked the attic / run the shower above] and saw [what you saw].",
    faqs: [
      {
        q: "Can I just paint over a water stain on the ceiling?",
        a: "Only after the leak is fixed and the drywall is completely dry. Use a stain-blocking primer first, usually oil- or shellac-based, or the stain will bleed through new paint.",
      },
      {
        q: "How do I know if a ceiling stain is old or active?",
        a: "Trace its edge in pencil and check it after rain or after using the bathroom above. A growing stain, damp or soft drywall, or a reading on an inexpensive moisture meter means it's active.",
      },
      {
        q: "Does a ceiling water stain mean there's mold?",
        a: "Not necessarily. The EPA advises drying wet materials within 24 to 48 hours to prevent mold growth, so a quick fix matters. Musty smells or dark spotting mean it's worth a closer look.",
      },
    ],
  },
  {
    slug: "cracks-in-drywall",
    title: "Cracks in drywall: which are normal and which aren't",
    metaTitle: "Drywall Cracks: Normal Settling or Structural? How to Tell",
    metaDescription:
      "Most drywall cracks are cosmetic settling you can patch for under $30. Signs that point to a structural problem, how to monitor a crack, and what repairs cost.",
    symptom: "Cracks in drywall",
    category: "walls_paint",
    reviewed: "2026-09-27",
    quickAnswer:
      "Most drywall cracks are cosmetic: hairline cracks at the corners of doors and windows or along taped seams, caused by normal settling, humidity swings and framing lumber drying out. They're a DIY patch for under $30. Cracks wider than about 1/4 inch, cracks that keep growing, or cracks that come with sticking doors, sloping floors or a sagging ceiling can point to foundation or structural movement and deserve a look from a structural engineer.",
    severity: "cosmetic",
    severityNote:
      "Cosmetic for hairline cracks. More serious if the crack is wide, growing, or comes with other signs of movement.",
    verdict: "diy",
    verdictNote: "Patching is a beginner job with joint compound, mesh tape and a putty knife. Structural questions are for an engineer.",
    safety: [
      "A sagging ceiling with cracks, or cracks that open quickly: keep people clear and call a structural engineer or contractor right away.",
    ],
    causes: [
      {
        cause: "Settling and seasonal movement",
        howToTell: "Hairline and diagonal, starting at the corners of doors or windows. Common in newer houses and with seasonal swings.",
        fix: "Patch with mesh tape and joint compound once it's stable.",
      },
      {
        cause: "Failed tape joint",
        howToTell: "A straight crack along a seam, sometimes with tape bubbling or peeling.",
        fix: "Cut out the loose tape, re-tape and re-mud.",
      },
      {
        cause: "Nail or screw pops",
        howToTell: "Small round bumps or cracks in a line, where the fasteners are.",
        fix: "Drive a drywall screw next to each one, then fill and paint.",
      },
      {
        cause: "Moisture damage",
        howToTell: "The crack comes with staining, or the drywall is soft or crumbly.",
        fix: "Find and fix the leak first, then replace the damaged section.",
      },
      {
        cause: "Structural movement",
        howToTell:
          "Wider than about 1/4 inch, growing, stair-stepping in brick or block, or with sticking doors and sloping floors.",
        fix: "Get a structural engineer's evaluation before patching.",
      },
    ],
    tryFirst: [
      "Measure the width. A coin edge or a crack gauge works.",
      "Mark the ends of the crack in pencil with the date, and check monthly.",
      "Photograph it next to a ruler.",
      "Check whether nearby doors and windows open and close normally.",
    ],
    callAPro: [
      "The crack is wider than about 1/4 inch.",
      "It keeps growing.",
      "Doors or windows start sticking, or floors slope.",
      "The ceiling sags.",
    ],
    costs: [
      { job: "Patch a hairline crack", diy: "$15–$30", pro: "$150–$400" },
      { job: "Re-tape a failed seam", diy: "$20–$40", pro: "$200–$500" },
      { job: "Structural engineer evaluation", diy: "—", pro: "$300–$800" },
      { job: "Foundation repair (if needed)", diy: "—", pro: "$2,000–$10,000+" },
    ],
    tellThePro:
      "I have a crack in my [wall / ceiling] about [length] long and [width] wide, running [diagonally from a door corner / along a seam / horizontally]. It [has / hasn't] grown since [date]. Nearby doors and windows [open normally / stick], and the floor [is level / slopes]. The house was built around [year].",
    faqs: [
      {
        q: "Are cracks in drywall normal?",
        a: "Hairline cracks, especially at door and window corners, are very common and usually just settling or seasonal movement. Wide, growing or stair-step cracks aren't normal.",
      },
      {
        q: "How do I stop a drywall crack from coming back?",
        a: "Don't just fill it. Open it up slightly, embed mesh or paper tape in joint compound, feather it out with two or three thin coats, then prime and paint. Setting-type compound holds up better than premixed for the first coat.",
      },
      {
        q: "When should I worry about a crack in my wall?",
        a: "When it's wider than about 1/4 inch, keeps growing, or comes with sticking doors, sloping floors or a sagging ceiling. Those can mean structural movement, and a structural engineer should look at it.",
      },
    ],
  },
  {
    slug: "no-hot-water",
    title: "No hot water: what to check on a gas or electric water heater",
    metaTitle: "No Hot Water? Gas and Electric Water Heater Fixes and Costs",
    metaDescription:
      "No hot water? Check the pilot on a gas heater, or the breaker and reset button on an electric one. What usually fails, what's safe to try, and repair costs.",
    symptom: "No hot water",
    category: "plumbing",
    reviewed: "2026-09-27",
    quickAnswer:
      "When a tank water heater stops making hot water, start with the simple things: a pilot that's gone out on a gas heater, or a tripped breaker or popped reset button on an electric one. If that's not it, the usual culprits are the thermocouple on a gas heater, or a heating element or thermostat on an electric one, and each typically costs $125 to $400 to have a plumber replace. If you smell gas, don't relight anything: leave the house and call your gas utility from outside.",
    severity: "fix_soon",
    severityNote:
      "Miserable, but not dangerous by itself. It becomes 'stop and call a pro now' if you smell gas, see scorching, or the relief valve is blowing hot water.",
    verdict: "diy_if_handy",
    verdictNote:
      "Relighting a pilot and resetting a breaker or reset button are DIY. Swapping an electric element or thermostat is a handy job if you can safely test a 240-volt circuit. Gas valve work is for a plumber.",
    safety: [
      "You smell gas or rotten eggs: don't relight the pilot or flip any switches. Leave the house and call your gas utility or 911 from outside.",
      "A carbon monoxide alarm is sounding: get everyone outside and call 911 from outside.",
      "The T&P relief valve is blowing hot water or steam: stay clear, shut off the power or gas, and call a plumber. The tank may be overheating.",
      "Soot or scorch marks around the burner door of a gas heater, or a burning smell or melted wiring on an electric one: shut it off and call a pro.",
    ],
    causes: [
      {
        cause: "A problem at one fixture, not the heater",
        howToTell: "Other taps run hot. Only one shower or faucet stays cold.",
        fix: "The cartridge or anti-scald valve in that fixture is clogged or worn. Replace the cartridge.",
      },
      {
        cause: "Pilot out or won't stay lit (gas)",
        howToTell:
          "No flame through the sight window at the bottom of the tank. On newer heaters, a status light may blink an error code.",
        fix: "Relight it by following the label on the tank. If it goes out when you let go of the knob, the thermocouple (the sensor that tells the gas valve the pilot is lit) is the usual suspect.",
      },
      {
        cause: "Gas supply or gas control valve (gas)",
        howToTell:
          "The pilot is lit but the main burner never comes on, or none of your gas appliances work. Power-vent heaters, the ones with a fan on top, also stop if they lose electricity.",
        fix: "Check the temperature dial isn't on Vacation or Low, the gas valve on the supply pipe is open, and a power-vent unit is plugged in. A failed gas control valve is a plumber's job.",
      },
      {
        cause: "Tripped breaker or high-limit reset (electric)",
        howToTell:
          "No hot water at all. The heater's breaker is tripped, or the red reset button behind the upper access panel has popped.",
        fix: "Reset the breaker once. With the breaker off, press the reset button. If it trips again, an element or thermostat is likely failing.",
      },
      {
        cause: "Failed heating element (electric)",
        howToTell:
          "Lukewarm water, or hot water runs out much faster than it used to. That's usually the lower element. A failed upper element usually means no hot water at all.",
        fix: "With the power off, test the elements with a multimeter. Elements are cheap, but replacing one means partly draining the tank.",
      },
      {
        cause: "Failed thermostat (electric)",
        howToTell:
          "The elements test good but the water stays cold, or the water gets scalding hot and the reset button keeps tripping.",
        fix: "Replace the thermostat with a matching one.",
      },
    ],
    tryFirst: [
      "Run hot water at a few taps to see whether it's the whole house or one fixture.",
      "Gas: look through the sight window for a flame. If the pilot is out and you don't smell gas, relight it by following the label on the tank. Check the dial isn't on Vacation.",
      "Electric: check the heater's breaker and reset it once if it's tripped.",
      "Electric: with the breaker off, remove the upper access panel, fold back the insulation and press the red reset button. Put it all back before turning the power on.",
      "Give it time. A gas tank takes about an hour to heat back up, an electric one two hours or more.",
    ],
    callAPro: [
      "The pilot won't light or won't stay lit.",
      "The burner won't come on with the pilot lit.",
      "The breaker or reset button trips again.",
      "Any gas smell, soot, scorching, or water around the base of the tank.",
    ],
    costs: [
      { job: "Plumber diagnostic visit", diy: "—", pro: "$100–$300" },
      { job: "Replace thermocouple (gas)", diy: "$10–$30", pro: "$125–$300" },
      { job: "Replace heating element (electric)", diy: "$15–$40", pro: "$175–$400" },
      { job: "Replace thermostat (electric)", diy: "$20–$50", pro: "$150–$350" },
      { job: "Replace gas control valve", diy: "Not recommended", pro: "$250–$750" },
      { job: "Replace a 40–50 gal tank water heater", diy: "Not recommended", pro: "$1,200–$3,500" },
    ],
    tellThePro:
      "My [gas / electric] tank water heater, about [age] years old, isn't making hot water [at any tap / at one fixture]. [The pilot won't stay lit / The pilot is lit but the burner won't come on / The breaker or reset button keeps tripping]. I've [relit the pilot / reset the breaker / pressed the reset button] and it [worked for a while / didn't help]. I don't smell gas and there's no water around the tank. Is it worth repairing at this age, and can you give me the price before you start?",
    faqs: [
      {
        q: "Why is there no hot water when the pilot light is on?",
        a: "The pilot is lit but the main burner isn't firing. Check that the temperature dial isn't set to Vacation or Low. If it's set right and the burner still won't come on, the burner may be clogged or the gas control valve may have failed. Both are jobs for a plumber.",
      },
      {
        q: "How do I reset an electric water heater?",
        a: "Turn off its breaker first. Remove the upper access panel, fold back the insulation and any plastic guard, and press the red button on the thermostat, often labeled Reset or ECO. Put it all back, turn the breaker on and wait an hour or two. If it trips again, don't keep resetting it: an element or thermostat needs testing.",
      },
      {
        q: "How long does it take to get hot water back?",
        a: "After a relight or reset, a gas tank usually has hot water again in about an hour. An electric tank heating from cold can take two hours or more.",
      },
      {
        q: "Should I repair or replace my water heater?",
        a: "A thermocouple, element or thermostat is usually worth replacing. If the tank is 10 or more years old, is leaking, or needs a new gas valve, replacing it often makes more sense. Tank heaters typically last 8 to 12 years.",
      },
    ],
  },
  {
    slug: "clogged-drain",
    title: "Clogged drain: how to clear a sink, tub or shower",
    metaTitle: "Clogged Drain? How to Clear a Sink, Tub or Shower Drain",
    metaDescription:
      "Most sink, tub and shower clogs are hair, soap or grease near the drain and clear with a plunger or snake. Signs it's the main line, and what a plumber charges.",
    symptom: "Clogged drain",
    category: "plumbing",
    reviewed: "2026-09-27",
    quickAnswer:
      "Most sink, tub and shower clogs are hair, soap scum or grease within a few feet of the drain. A plunger, a plastic drain stick or a hand snake clears most of them for under $50, and a plumber typically charges $125 to $350 to clear a single drain. If several drains are slow at once, toilets gurgle when other fixtures drain, or sewage comes up in a tub or floor drain, the main line is likely blocked: stop using water and call a plumber.",
    severity: "fix_soon",
    severityNote:
      "One slow drain can wait a few days. Several drains backing up at once, or sewage coming up anywhere, is urgent.",
    verdict: "diy",
    verdictNote:
      "A drain stick, plunger or hand snake clears most single-drain clogs. Main line clogs need a plumber with a powered machine.",
    safety: [
      "Sewage or dirty water is coming up in a tub, shower or floor drain: stop running water anywhere in the house and call a plumber. Keep kids and pets away from it.",
      "You've already poured in a chemical drain cleaner: don't plunge, snake, or add another product. It can splash back and burn skin and eyes, and mixing products can release toxic gas. Tell the plumber what you used.",
    ],
    causes: [
      {
        cause: "Hair and soap scum",
        howToTell: "A tub, shower or bathroom sink that has drained slower and slower over weeks.",
        fix: "Pull the stopper and fish out the hair with a plastic drain stick or a small hand snake. Flush with hot tap water.",
      },
      {
        cause: "Grease and food",
        howToTell: "The kitchen sink backs up, sometimes into the other bowl or the dishwasher.",
        fix: "Plunge with the other bowl's drain plugged. If that fails, clean the trap or snake the line past it. Wipe grease into the trash from now on.",
      },
      {
        cause: "Clogged trap",
        howToTell: "One sink is slow or stopped and plunging doesn't help. Something may have fallen in.",
        fix: "Put a bucket under the U-shaped trap, unscrew the slip nuts and clean it out. Hand-tighten the nuts when you put it back.",
      },
      {
        cause: "Clog past the trap",
        howToTell: "The trap is clear but the drain still backs up.",
        fix: "Feed a hand snake (drain auger) into the pipe in the wall. If it runs out of reach, call a plumber.",
      },
      {
        cause: "Blocked vent",
        howToTell: "Gurgling, slow drains and sewer smells that come back even after the drain has been cleared.",
        fix: "The vent pipe on the roof may be blocked by debris or a nest. A plumber clears it. Leave the roof to a pro.",
      },
      {
        cause: "Main sewer line clog",
        howToTell:
          "Several drains are slow at once, toilets gurgle when the sink or washer drains, or water comes up in the tub or a basement floor drain.",
        fix: "Stop using water and call a plumber. They clear it from the cleanout and may run a camera to check for roots or a broken pipe.",
      },
    ],
    tryFirst: [
      "Check whether it's one drain or several. Several at once points to the main line: stop and call a plumber.",
      "Pull the stopper or strainer and fish out hair with a plastic drain stick.",
      "Use a cup plunger on sinks and tubs. Block the overflow hole with a wet rag, and plug the other side of a double sink.",
      "If plunging fails, clean out the sink trap over a bucket, or feed a hand snake in for a clog past it.",
      "Flush with hot tap water once it drains. Skip chemical cleaners, and never mix two of them.",
    ],
    callAPro: [
      "More than one drain is slow or backing up.",
      "Sewage or dirty water comes up in a tub, shower or floor drain.",
      "The clog comes back within weeks, or a hand snake can't reach it.",
      "You've used a chemical cleaner and the drain is still full of it.",
    ],
    costs: [
      { job: "Plunger or plastic drain stick", diy: "$5–$25", pro: "—" },
      { job: "Hand snake (drain auger)", diy: "$15–$50", pro: "—" },
      { job: "Clear a sink, tub or shower drain", diy: "—", pro: "$125–$350" },
      { job: "Clear a main sewer line", diy: "Not recommended", pro: "$200–$800" },
      { job: "Sewer camera inspection", diy: "—", pro: "$150–$500" },
    ],
    tellThePro:
      "My [kitchen sink / bathroom sink / tub / shower] drain is [slow / completely stopped]. It's [the only slow drain / one of several], and I [have / haven't] seen gurgling or water coming up elsewhere when [toilets flush / the washer drains]. I've tried [plunging / cleaning the trap / a hand snake]. I [haven't used / have used (product)] a chemical drain cleaner. The cleanout is [location / somewhere I haven't found].",
    faqs: [
      {
        q: "Are chemical drain cleaners safe to use?",
        a: "They're harsh on skin and eyes, they often don't fully clear hair clogs, and they make any follow-up work risky because the chemical sits in the drain. Never mix two products, and never plunge after using one. A drain stick, plunger or hand snake is safer and usually faster.",
      },
      {
        q: "How do I know if my main sewer line is clogged?",
        a: "Look for more than one drain acting up at once: toilets gurgling when a sink or washer drains, water rising in the tub when you flush, or a backup in a basement floor drain. A single slow drain is almost always a local clog.",
      },
      {
        q: "Will baking soda and vinegar unclog a drain?",
        a: "Rarely. The fizz looks busy, but it doesn't have much power against a real clog of hair or grease. Pulling the clog out with a drain stick, plunger or snake works better.",
      },
      {
        q: "How do I keep drains from clogging?",
        a: "Use a hair catcher in tubs and showers, wipe grease and food scraps into the trash instead of the sink, and pull hair from bathroom stoppers every month or two.",
      },
    ],
  },
  {
    slug: "low-water-pressure",
    title: "Low water pressure: one faucet or the whole house",
    metaTitle: "Low Water Pressure? Causes for One Faucet or the Whole House",
    metaDescription:
      "Low pressure at one faucet is usually a clogged aerator. Everywhere, it's a valve, pressure regulator, leak or the supply. How to tell, and what it costs.",
    symptom: "Low water pressure",
    category: "plumbing",
    reviewed: "2026-09-27",
    quickAnswer:
      "First figure out whether it's one fixture or the whole house. Low pressure at one faucet or shower is usually a clogged aerator or showerhead that you can clean with vinegar for next to nothing. Low pressure everywhere points to a partly closed main valve, a failing pressure-reducing valve (typically $300 to $900 to replace), a hidden leak, old galvanized pipes, or a problem with the water supply. A sudden drop is worth a same-day leak check at your water meter.",
    severity: "fix_soon",
    severityNote:
      "Low pressure at one faucet is an annoyance. A sudden whole-house drop can mean a leak, so check the meter the same day.",
    verdict: "diy_if_handy",
    verdictNote:
      "Cleaning aerators and showerheads and checking valves are simple DIY. A cartridge swap is a handy job. Pressure regulators, leak repairs and repiping are for a plumber.",
    causes: [
      {
        cause: "Clogged aerator or showerhead",
        howToTell:
          "Only one faucet or shower is weak, and the flow sputters or sprays sideways. Common with hard water.",
        fix: "Unscrew the aerator or showerhead and soak it in white vinegar for an hour or more to dissolve the scale, or replace it.",
      },
      {
        cause: "Clogged or worn cartridge",
        howToTell: "One fixture is still weak with the aerator off, or only its hot or cold side is weak.",
        fix: "Replace the cartridge. Bring the old one to the store to match it.",
      },
      {
        cause: "Partly closed valve",
        howToTell:
          "The whole house is weak, often right after plumbing work. Or one fixture's shutoff under the sink isn't fully open.",
        fix: "Open the main shutoff and the fixture shutoffs fully. A round-handle valve turns fully counterclockwise. A lever-handle valve is open when the lever lines up with the pipe.",
      },
      {
        cause: "Failing pressure-reducing valve",
        howToTell:
          "Pressure dropped across the whole house, slowly or all at once, and there's a bell-shaped valve on the main line where it enters the house.",
        fix: "A pressure gauge on a hose spigot confirms it. A plumber can adjust or replace the valve.",
      },
      {
        cause: "Hidden leak",
        howToTell:
          "Pressure dropped suddenly, the water bill jumped, or you hear water running with everything off. The meter moves with every tap closed.",
        fix: "Find and repair the leak. A plumber can locate one that's inside a wall, under a slab or in the yard.",
      },
      {
        cause: "Old galvanized pipes",
        howToTell:
          "Gray threaded steel pipes, usually in houses built before the 1960s. Pressure has slowly gotten worse everywhere, and the water may run rusty at first.",
        fix: "The pipes are closing up inside with rust and scale. Replacing them is the only real fix.",
      },
      {
        cause: "Water supply or well",
        howToTell:
          "Neighbors have low pressure too, or there's work on the water main. On a private well, pressure is weak or surges and drops.",
        fix: "Call your water utility. On a well, a well contractor checks the pressure switch, pressure tank and pump.",
      },
    ],
    tryFirst: [
      "Test several faucets, hot and cold, to see whether it's one fixture, one side, or the whole house. If it's the whole house, ask a neighbor if theirs is low too.",
      "Unscrew the aerator or showerhead and soak it in white vinegar.",
      "Check the shutoff valves under the sink and at the main, and make sure they're fully open.",
      "Screw a pressure gauge onto an outdoor hose spigot. Most homes run about 40 to 60 psi.",
      "Turn off every tap and water-using appliance, then watch the water meter for 15 minutes. If it moves, you have a leak.",
    ],
    callAPro: [
      "The meter shows a leak and you can't find it.",
      "The whole house is low and all the valves are open.",
      "Your pipes are old galvanized steel and pressure keeps getting worse.",
      "You're on a well and pressure is weak or surging.",
    ],
    costs: [
      { job: "Clean or replace an aerator or showerhead", diy: "$0–$40", pro: "—" },
      { job: "Replace a faucet or shower cartridge", diy: "$15–$60", pro: "$150–$350" },
      { job: "Replace a pressure-reducing valve", diy: "Not recommended", pro: "$300–$900" },
      { job: "Leak detection visit", diy: "—", pro: "$150–$500" },
      { job: "Repipe a house with galvanized pipes", diy: "Not recommended", pro: "$4,000–$15,000+" },
    ],
    tellThePro:
      "I have low water pressure [at one faucet / on the hot side only / throughout the house]. It started [gradually / suddenly on (date)]. I've [cleaned the aerator / checked that the valves are fully open / tested with a gauge and got (reading) psi]. The meter [does / doesn't] move with everything off. The house was built around [year] and [has / doesn't have] a pressure-reducing valve.",
    faqs: [
      {
        q: "What is normal water pressure for a house?",
        a: "Usually about 40 to 60 psi. Plumbing codes generally call for a pressure-reducing valve when street pressure is above 80 psi. A $10 to $20 gauge on a hose spigot tells you where you are.",
      },
      {
        q: "Why is my water pressure suddenly low?",
        a: "A sudden drop across the house usually means a closed or partly closed valve, a failed pressure-reducing valve, a leak, or work on the water main. Check with a neighbor, then check your meter for a leak.",
      },
      {
        q: "Why is only my hot water pressure low?",
        a: "If every hot tap is weak, look at the water heater: a partly closed valve on its pipes, or sediment built up in the tank and fittings. If it's one faucet, the hot side of its cartridge is the likely cause.",
      },
      {
        q: "Can a pressure-reducing valve go bad?",
        a: "Yes. They wear out and can fail low, giving weak pressure, or fail high, which can show up as banging pipes or a dripping relief valve on the water heater. A plumber can test and replace one.",
      },
    ],
  },
  {
    slug: "garbage-disposal-not-working",
    title: "Garbage disposal not working: how to reset, unjam or replace it",
    metaTitle: "Garbage Disposal Not Working? How to Reset, Unjam or Replace It",
    metaDescription:
      "Garbage disposal humming, jammed or leaking? How to reset it and free a jam safely with a hex key, when a leak means replacing it, and what a plumber charges.",
    symptom: "Garbage disposal not working",
    category: "plumbing",
    reviewed: "2026-09-27",
    quickAnswer:
      "If a garbage disposal hums but won't spin, it's jammed: cut the power, then work it free with a hex key (usually 1/4-inch) in the socket on the bottom of the unit. If it's completely silent, press the red reset button on the bottom and check the breaker, the wall switch and the plug. A disposal leaking from its body usually needs replacing, typically $250 to $750 installed. Never put your hand inside it, even with the power off.",
    severity: "fix_soon",
    severityNote:
      "A jammed or dead disposal is an inconvenience. A leak is more pressing, because water under the sink ruins the cabinet and can reach the outlet the disposal plugs into.",
    verdict: "diy",
    verdictNote:
      "Resetting and unjamming take a few minutes and a hex key. Swapping in a new plug-in unit is a job for a handy homeowner. Hardwired units and dead switches or outlets are for an electrician.",
    safety: [
      "Water is dripping onto the outlet or wiring under the sink: switch off the breaker before you touch anything.",
      "Burning smell or smoke from the unit: turn it off at the breaker and don't run it again.",
      "Something is stuck that tongs or pliers can't reach: never reach in by hand. Leave the power off and call a plumber.",
    ],
    causes: [
      {
        cause: "Jammed",
        howToTell: "It hums but nothing spins, and it may shut itself off after a few seconds.",
        fix: "With the power off, turn the hex socket on the bottom back and forth with a hex key until it moves freely. Most units take a 1/4-inch key, and many come with one. Pull out the object with tongs or pliers.",
      },
      {
        cause: "Tripped overload",
        howToTell:
          "Completely silent, often right after a jam or a long run. The red reset button on the bottom has popped out.",
        fix: "Let it cool for about 10 minutes, then press the reset button in until it clicks.",
      },
      {
        cause: "No power",
        howToTell:
          "Silent, and the reset button isn't popped. The breaker or a GFCI outlet may have tripped, the plug may be loose, or the wall switch may have failed.",
        fix: "Reset the breaker or GFCI and check the plug under the sink. A dead switch or outlet is an electrician's job.",
      },
      {
        cause: "Burned-out motor",
        howToTell: "It has power and you've reset and unjammed it, but it still only hums or stays silent.",
        fix: "Replace the unit. Repairing a disposal motor rarely makes sense.",
      },
      {
        cause: "Leak",
        howToTell:
          "Water at the top (the sink flange), the side (the dishwasher hose or drain pipe) or the bottom (the unit itself).",
        fix: "Top: tighten the mounting ring or reseal the flange with plumber's putty. Side: tighten the clamp or replace the gasket. Bottom or body: the internal seals have failed, so replace the unit.",
      },
      {
        cause: "Clog below the disposal",
        howToTell: "It runs fine but water backs up in the sink or into the other bowl.",
        fix: "Clear the trap or the drain line. Skip chemical drain cleaners: they can damage the disposal and splash back at you.",
      },
    ],
    tryFirst: [
      "Switch it off at the wall, then unplug it under the sink or switch off its breaker.",
      "Shine a flashlight in. Pull out anything stuck with tongs or pliers, never your hand.",
      "Put a hex key (usually 1/4-inch) in the socket in the center of the bottom and work it back and forth until it turns freely.",
      "Wait 10 minutes and press the red reset button on the bottom. Then restore power, run cold water and switch it on.",
      "For a leak, dry everything, run water with a few drops of food coloring in the sink, and watch where it shows up first.",
    ],
    callAPro: [
      "It still hums or stays silent after unjamming and resetting.",
      "It leaks from the bottom or the body of the unit.",
      "The wall switch or outlet is dead, or the unit is hardwired.",
      "The sink still backs up after you've cleared the trap.",
    ],
    costs: [
      { job: "Unjam and reset", diy: "$0–$10", pro: "$100–$250" },
      { job: "Reseal the sink flange or replace a gasket", diy: "$5–$20", pro: "$125–$250" },
      { job: "Clear a clog below the disposal", diy: "$0–$30", pro: "$125–$350" },
      { job: "Replace a disposal (1/3 to 3/4 hp)", diy: "$100–$350", pro: "$250–$750" },
      { job: "Replace a dead switch or outlet", diy: "Not recommended", pro: "$150–$350" },
    ],
    tellThePro:
      "My garbage disposal [hums but won't spin / is completely silent / leaks from the top / leaks from the bottom]. I've [pressed the reset button / turned it with a hex key / checked the breaker] and it still [hums / does nothing / leaks]. It's about [age] years old and [plugs in under the sink / is hardwired]. If it needs replacing, what size would you put in, and does your price include the unit, haul-away and reconnecting the dishwasher?",
    faqs: [
      {
        q: "Why does my garbage disposal hum but not work?",
        a: "It's jammed. The motor is getting power but something is stopping it from turning. Switch it off right away so the motor doesn't overheat, cut the power, and free it with a hex key (usually 1/4-inch) in the socket on the bottom.",
      },
      {
        q: "Where is the reset button on a garbage disposal?",
        a: "On the bottom of the unit, usually a small red button. If it's popped out, the motor overheated and shut itself off. Let it cool for about 10 minutes, then press it in until it clicks.",
      },
      {
        q: "Is it safe to reach into a garbage disposal?",
        a: "No. Someone can hit the switch, and the edges inside can cut. Cut the power at the plug or breaker and use tongs or pliers to pull things out.",
      },
      {
        q: "Is a leaking garbage disposal worth fixing?",
        a: "It depends where it leaks. Leaks at the sink flange or the pipe connections are cheap fixes. A leak from the body or the bottom means the internal seals have failed, and the unit needs replacing.",
      },
    ],
  },
  {
    slug: "gfci-outlet-wont-reset",
    title: "GFCI outlet won't reset: what it means and what's safe to try",
    metaTitle: "GFCI Outlet Won't Reset? Causes, Safe Fixes and Costs",
    metaDescription:
      "A GFCI that won't reset usually has no power, a real ground fault, or has worn out. How to check each safely, when water makes it urgent, and electrician costs.",
    symptom: "GFCI outlet won't reset",
    category: "electrical",
    reviewed: "2026-09-27",
    quickAnswer:
      "A GFCI outlet that won't reset usually has no power, is detecting a real ground fault, or has worn out. Check the breaker and press Reset on every other GFCI in the house: one GFCI can protect several outlets, and most newer ones won't reset without power. If it still won't reset with everything unplugged, a new GFCI costs $15 to $35 in parts or about $125 to $300 installed by an electrician. If there's water in or near the outlet, leave it off and call an electrician.",
    severity: "fix_soon",
    severityNote:
      "A GFCI that won't reset has cut the power, so it's usually not dangerous on its own. It's 'stop and call a pro now' if there's water in or near the outlet, scorching, or a burning smell.",
    verdict: "diy_if_handy",
    verdictNote:
      "Finding the tripped GFCI and unplugging devices is DIY. Replacing a GFCI is doable if you can shut off and test a circuit and connect the line and load wires correctly. Wiring faults are for an electrician.",
    safety: [
      "Water is on or in the outlet, or it's near standing water: don't touch it. Switch off the breaker from a dry spot and call an electrician.",
      "Scorch marks, melted plastic, buzzing or a burning smell: leave the breaker off and call an electrician.",
      "Someone felt a tingle or a shock from an appliance, faucet or outlet: stop using that circuit and call an electrician.",
    ],
    causes: [
      {
        cause: "Tripped breaker",
        howToTell: "The GFCI won't reset, and other outlets or lights on the same circuit are dead too.",
        fix: "Reset the breaker once. If it trips again, leave it off and call an electrician.",
      },
      {
        cause: "Another GFCI upstream has tripped",
        howToTell:
          "The breaker is on, but this outlet is dead and Reset won't latch. One GFCI often protects several outlets, sometimes in another room, the garage or outside.",
        fix: "Find and reset the other GFCI. Check kitchens, bathrooms, the garage, the basement, outdoor outlets and the panel for a GFCI breaker.",
      },
      {
        cause: "A real ground fault",
        howToTell:
          "It resets, then trips again right away or as soon as something is plugged in, here or at an outlet downstream of it. Often worse when it's damp.",
        fix: "Unplug everything on the GFCI and the outlets it protects, then reset. If it holds, plug things back in one at a time to find the bad device. If it trips with nothing plugged in, the fault is in the wiring.",
      },
      {
        cause: "Moisture in the box",
        howToTell: "An outdoor, garage or bathroom outlet that trips after rain, a leak or a steamy shower.",
        fix: "Leave it off and let it dry out. Outdoor outlets need a weatherproof in-use (bubble) cover. If water got into the box, have an electrician check it before you use it again.",
      },
      {
        cause: "Worn-out GFCI",
        howToTell:
          "A voltage tester shows power at the outlet, nothing is plugged in, and it still won't reset. Or it doesn't trip when you press Test.",
        fix: "Replace the GFCI outlet.",
      },
      {
        cause: "Line and load wired backwards",
        howToTell: "The GFCI was just installed and has never reset.",
        fix: "The wires from the panel belong on the Line terminals. With the breaker off, move them, or call an electrician.",
      },
    ],
    tryFirst: [
      "With dry hands, unplug everything from the GFCI and the outlets near it.",
      "Press Reset firmly until it clicks. If it won't latch at all, it probably has no power.",
      "Check the panel for a tripped breaker or a GFCI breaker, and reset it once.",
      "Press Reset on every other GFCI in the kitchen, bathrooms, garage, basement and outside.",
      "Once it resets, press Test to make sure it trips, then Reset again. Plug devices back in one at a time.",
    ],
    callAPro: [
      "It won't reset with the breaker on and no other GFCI tripped.",
      "It trips with nothing plugged in.",
      "Outdoor or garage outlets trip every time it rains.",
      "Fixing it means opening the box and you're not sure how to test for power.",
    ],
    costs: [
      { job: "Replace a GFCI outlet", diy: "$15–$35", pro: "$125–$300" },
      { job: "Add a weatherproof in-use cover", diy: "$10–$30", pro: "$100–$250" },
      { job: "Electrician diagnostic visit", diy: "—", pro: "$100–$300" },
      { job: "Replace a GFCI breaker", diy: "Not recommended", pro: "$200–$450" },
    ],
    tellThePro:
      "A GFCI outlet in my [bathroom / kitchen / garage / outside] won't reset. The breaker [is on / keeps tripping]. I've checked the other GFCIs in [rooms] and [found one tripped / found nothing]. With everything unplugged it [still won't reset / resets but trips when (device) is plugged in / trips when it rains]. I [have / haven't] seen water, scorching or a burning smell. The outlet is about [age] years old.",
    faqs: [
      {
        q: "Why won't my GFCI outlet reset?",
        a: "Most often it has no power, because a breaker or another GFCI that feeds it has tripped. Most newer GFCIs won't reset without power. If it has power, there may be a ground fault on the circuit, or the GFCI has worn out.",
      },
      {
        q: "Can I replace a GFCI outlet myself?",
        a: "If you're comfortable turning off the breaker, confirming the power is off with a tester, and connecting the line and load wires correctly, yes. If the box has more wires than you expect or you aren't sure which are which, call an electrician.",
      },
      {
        q: "What does a GFCI actually do?",
        a: "It compares the current going out on a circuit with the current coming back. If a few milliamps go missing, which can mean electricity is flowing through water or a person, it cuts the power in a fraction of a second. That's why they're required in kitchens, bathrooms, garages, outdoors and other wet areas.",
      },
      {
        q: "How often should I test a GFCI?",
        a: "Manufacturers recommend once a month: press Test, confirm the power goes off, then press Reset. If it doesn't trip when you press Test, replace it.",
      },
    ],
  },
  {
    slug: "smoke-detector-chirping",
    title: "Smoke or CO detector chirping: why, and how to make it stop",
    metaTitle: "Smoke or CO Detector Chirping? Why It Happens and How to Stop It",
    metaDescription:
      "A chirp every 30 to 60 seconds usually means a low battery or a worn-out alarm. How to stop it, tell a chirp from a real alarm, and what to do for CO.",
    symptom: "Smoke detector chirping",
    category: "electrical",
    reviewed: "2026-09-27",
    quickAnswer:
      "A smoke or carbon monoxide (CO) detector that chirps once every 30 to 60 seconds usually needs a new battery. If it keeps chirping with a fresh battery, check the manufacture date on the back: smoke alarms should be replaced 10 years after that date, and many chirp at end of life. A battery costs a few dollars and a new alarm about $15 to $80. A loud, repeating alarm is different: treat it as real, and if it's a CO alarm, get everyone outside and call 911.",
    severity: "urgent",
    severityNote:
      "The chirp itself isn't dangerous, but an alarm that's chirping may not be able to warn you. Fix it today or tomorrow, not next month.",
    verdict: "diy",
    verdictNote:
      "Changing a battery or a whole alarm is a DIY job with a step ladder. Hardwired alarms usually plug into a connector. If the wiring needs changing, call an electrician.",
    safety: [
      "A CO alarm is sounding a full alarm (on most newer models, four beeps and a pause, repeating): get everyone, including pets, outside and call 911 or the fire department from outside. Don't go back in until they say it's safe.",
      "A smoke alarm is sounding a full alarm (usually three beeps and a pause, repeating) and it isn't clearly from cooking: get everyone out and call 911 from outside.",
      "Anyone has a headache, dizziness, nausea or confusion that eases outdoors, especially several people at once: get out and call 911, even if no alarm is sounding.",
    ],
    causes: [
      {
        cause: "Low battery",
        howToTell:
          "One short chirp every 30 to 60 seconds from one alarm. It often starts in the middle of the night, when the house is coolest and a weak battery has the least to give.",
        fix: "Replace the battery with the type printed on the alarm. Hardwired alarms have a backup battery too.",
      },
      {
        cause: "End of life",
        howToTell:
          "It keeps chirping with a fresh battery, or it has a sealed battery that can't be changed. A smoke alarm's manufacture date is 10 or more years ago, or a CO alarm is past its replace-by date.",
        fix: "Replace the whole alarm. It can't be fixed.",
      },
      {
        cause: "Leftover low-battery warning",
        howToTell: "It started or kept chirping right after you changed the battery.",
        fix: "Make sure the battery is the right type, fully seated, and the drawer is closed. Take the battery out, hold the test button for about 15 seconds, then put it back and press Test.",
      },
      {
        cause: "Fault or dirty sensor",
        howToTell: "A different chirp pattern, a flashing error light, or false alarms with no smoke.",
        fix: "Vacuum the vents gently. The label on the back explains the light and chirp codes. If the fault continues, replace the alarm.",
      },
      {
        cause: "It's a different device",
        howToTell:
          "The chirp continues after you've changed the battery. Chirps echo and are hard to place, and CO alarms, other smoke alarms, and battery-powered thermostats or security sensors can chirp too.",
        fix: "Stand under each alarm and wait for the chirp before you change anything else.",
      },
    ],
    tryFirst: [
      "Make sure it's a chirp, not an alarm. A chirp is one short beep every 30 to 60 seconds. An alarm is loud and doesn't stop.",
      "Find the chirping unit by standing under each alarm and waiting.",
      "Check the date on the back. A smoke alarm 10 or more years old needs replacing, not a new battery.",
      "Replace the battery with the type printed on the alarm. For a hardwired alarm, switch off its breaker and unplug it from its connector first.",
      "With the battery out, hold the test button for about 15 seconds. Then put the new battery in and press Test.",
    ],
    callAPro: [
      "A hardwired alarm keeps chirping after a new battery and a new alarm.",
      "You're switching to a different brand of hardwired alarm and the connector doesn't match.",
      "The alarms are on ceilings you can't safely reach.",
      "A CO alarm has gone off. Have a licensed HVAC tech inspect fuel-burning appliances before you use them again.",
    ],
    costs: [
      { job: "Replace a 9-volt or AA battery", diy: "$3–$10", pro: "—" },
      { job: "Replace a battery-only smoke alarm", diy: "$15–$50", pro: "$75–$200" },
      { job: "Replace a hardwired smoke alarm (same connector)", diy: "$25–$60", pro: "$100–$300" },
      { job: "Replace with a combination smoke and CO alarm", diy: "$30–$80", pro: "$100–$300" },
      { job: "Add a new hardwired, interconnected alarm", diy: "Not recommended", pro: "$200–$500" },
    ],
    tellThePro:
      "I have [number] [hardwired / battery-only] [smoke / CO / combination] alarms. The one in the [location] keeps chirping [every 30 to 60 seconds / in a different pattern]. I've [replaced the battery / held the test button / replaced the alarm] and it still chirps. They're about [age] years old, [interconnected / separate], and the ceilings are about [height]. Can you replace them, and does your price include the alarms?",
    faqs: [
      {
        q: "Why is my smoke detector still chirping after I changed the battery?",
        a: "Usually one of three things: the alarm is past its 10-year life, the new battery isn't seated or is the wrong type, or the alarm is holding on to the low-battery warning. Take the battery out, hold the test button for about 15 seconds, and put it back. If it still chirps, check the date on the back and replace the alarm.",
      },
      {
        q: "How do I tell a chirp from a real alarm?",
        a: "A chirp is a single short beep every 30 to 60 seconds and means the alarm needs attention. A real alarm is loud and keeps going. Most newer smoke alarms sound three beeps and a pause, and CO alarms sound four beeps and a pause. Treat any full alarm as real until you know otherwise.",
      },
      {
        q: "How long do smoke and CO detectors last?",
        a: "Replace smoke alarms 10 years after the manufacture date printed on the back. CO alarms typically last 5 to 10 years depending on the model, and many print a replace-by date on the label. Press Test on every alarm once a month.",
      },
      {
        q: "What should I do if my CO alarm goes off?",
        a: "Get everyone, including pets, outside into fresh air right away, and call 911 or the fire department from outside. Don't go back in until they say it's safe, even if the alarm stops. Carbon monoxide has no color or smell, so the alarm may be your only warning.",
      },
    ],
  },
  {
    slug: "furnace-not-heating",
    title: "Furnace not turning on or not heating: what to check first",
    metaTitle: "Furnace Not Turning On or Not Heating? Checks and Repair Costs",
    metaDescription:
      "Furnace won't turn on or blows cold air? Check the thermostat, filter, switch and breaker first. The parts that usually fail, when to get out, and repair costs.",
    symptom: "Furnace not heating",
    category: "hvac",
    reviewed: "2026-09-27",
    quickAnswer:
      "When a furnace won't turn on or blows cold air, check the easy things first: the thermostat set to Heat with fresh batteries, the power switch and breaker on, a clean filter, and the front panel on tight. If those check out, the usual culprits are a dirty flame sensor, a failed igniter, or a clogged condensate drain on a high-efficiency furnace, typically $75 to $450 to fix. If a carbon monoxide alarm sounds or you smell gas, get everyone out and call 911 or your gas utility from outside.",
    severity: "urgent",
    severityNote:
      "Urgent in cold weather, especially with babies, older adults, or pipes at risk of freezing. 'Stop and call a pro now' if a CO alarm sounds or you smell gas.",
    verdict: "diy_if_handy",
    verdictNote:
      "Thermostat, filter, switch, breaker and condensate checks are DIY. Cleaning a flame sensor is a handy job. Gas valves, burners, control boards and heat exchangers are for a licensed HVAC tech.",
    safety: [
      "A carbon monoxide alarm is sounding, or people feel headachy, dizzy or sick when the heat runs: get everyone out, call 911 from outside, and don't go back in until responders say it's safe.",
      "You smell gas or rotten eggs: don't touch switches or the thermostat. Leave the house and call your gas utility or 911 from outside.",
      "Soot or scorch marks on the furnace, or flames outside the burner area: turn it off and call a technician.",
      "A rollout switch (a small safety switch near the burners, often with a reset button) has tripped: don't keep resetting it. It can mean a blocked flue or a cracked heat exchanger, which can leak carbon monoxide.",
    ],
    causes: [
      {
        cause: "Thermostat",
        howToTell: "The display is blank, it's set to Cool or Off, or the setpoint is below room temperature.",
        fix: "Set it to Heat, a few degrees above room temperature. Replace the batteries.",
      },
      {
        cause: "Power switch or breaker off",
        howToTell:
          "Nothing happens at all: no fan, no click, no status light. The furnace switch, which looks like a light switch on or near the unit, is off, or the breaker is tripped.",
        fix: "Turn the switch on and reset the breaker once. If the breaker trips again, call a technician.",
      },
      {
        cause: "Clogged filter tripping the high-limit switch",
        howToTell:
          "Weak airflow. The burners light, run a few minutes, then shut off while the blower keeps going.",
        fix: "Replace the filter and open any closed supply vents. If it keeps shutting off, a tech needs to find out why it's overheating.",
      },
      {
        cause: "Pilot out or igniter failed",
        howToTell:
          "On most furnaces, a small draft fan starts but the burners never light, and the igniter doesn't glow. On an older furnace, the pilot is out.",
        fix: "Relight a standing pilot by following the label on the furnace. A cracked or dead igniter needs replacing.",
      },
      {
        cause: "Dirty flame sensor",
        howToTell: "The burners light, then shut off within a few seconds. It tries a few times, then locks out.",
        fix: "With the power off, remove the sensor rod and clean it gently with a fine abrasive pad. A tech does it in minutes.",
      },
      {
        cause: "Clogged condensate drain (high-efficiency furnaces)",
        howToTell:
          "A furnace with white plastic vent pipes won't fire or keeps shutting off, sometimes with water around the base.",
        fix: "Clear the condensate line and trap. A safety switch keeps the furnace off while the water can't drain.",
      },
      {
        cause: "Control board or blower motor",
        howToTell: "The status light flashes an error code, or the burners light but no air comes out of the vents.",
        fix: "Look up the code on the chart inside the panel door and give it to the tech. Boards and motors are a technician's job.",
      },
    ],
    tryFirst: [
      "Set the thermostat to Heat, a few degrees above room temperature, and replace its batteries.",
      "Check the furnace power switch and the breaker, and replace the air filter.",
      "Make sure the furnace's front panel is on tight. A safety switch keeps it off when the door is loose.",
      "On a high-efficiency furnace, check the white plastic pipes outside for snow, ice or debris, and look for water around the base.",
      "Note any blinking status light pattern, then switch the furnace off for about 30 seconds and back on to clear a lockout. Once, not over and over.",
    ],
    callAPro: [
      "The burners won't light, or they still shut off after you've cleaned the flame sensor.",
      "It locks out again or flashes the same error code after a reset.",
      "A limit or rollout switch keeps tripping.",
      "Any gas smell, CO alarm, soot or scorching.",
    ],
    costs: [
      { job: "Replace air filter", diy: "$10–$40", pro: "—" },
      { job: "HVAC diagnostic visit", diy: "—", pro: "$75–$200" },
      { job: "Clean or replace flame sensor", diy: "$0–$40", pro: "$75–$300" },
      { job: "Clear condensate drain or trap", diy: "$0–$20", pro: "$100–$250" },
      { job: "Replace hot surface igniter", diy: "$20–$80", pro: "$150–$450" },
      { job: "Replace control board", diy: "Not recommended", pro: "$300–$900" },
    ],
    tellThePro:
      "My [gas / propane] furnace, about [age] years old, [won't turn on at all / runs but blows cold air / lights and shuts off after a few seconds]. It's a [standard / high-efficiency with white plastic vent pipes] model. I've checked the thermostat, switch, breaker and filter. The status light is flashing [pattern or code]. There's no gas smell and no CO alarm. Can you give me an itemized price before you start?",
    faqs: [
      {
        q: "Why is my furnace running but blowing cold air?",
        a: "Either the burners aren't lighting or staying lit, or the thermostat fan is set to On instead of Auto, which runs the blower between heating cycles. Set the fan to Auto first. If the air stays cold, the usual causes are a dirty flame sensor, a failed igniter, a clogged condensate drain, or the high-limit switch tripping from a clogged filter.",
      },
      {
        q: "How do I reset my furnace?",
        a: "Switch off the furnace power switch or breaker for about 30 seconds, then turn it back on. That clears a lockout on most modern furnaces. If it locks out again, don't keep cycling it. Call a technician and give them the error code.",
      },
      {
        q: "How do I keep the house warm until the furnace is fixed?",
        a: "Close the doors to rooms you aren't using. In freezing weather, open the cabinet doors under sinks and let faucets drip to protect pipes. Keep space heaters 3 feet from anything that can burn and plug them straight into the wall. Never heat the house with a gas oven or stove, a grill or a generator: they can produce deadly carbon monoxide.",
      },
      {
        q: "What should I do if my carbon monoxide alarm goes off?",
        a: "Get everyone, including pets, outside into fresh air right away and call 911 from outside. Don't go back in until the fire department says it's safe. Carbon monoxide has no color or smell, so the alarm may be your only warning. Have a licensed HVAC tech inspect the furnace and other fuel-burning appliances before you use them again.",
      },
    ],
  },
  {
    slug: "mold-on-bathroom-ceiling",
    title: "Mold on the bathroom ceiling or walls: clean it and stop it coming back",
    metaTitle: "Mold on Bathroom Ceiling? How to Clean It and When to Call a Pro",
    metaDescription:
      "Small patches of bathroom mold are a DIY cleanup. How to clean it safely, stop it coming back with better ventilation, when it needs a pro, and what fixes cost.",
    symptom: "Mold on bathroom ceiling",
    category: "walls_paint",
    reviewed: "2026-09-27",
    quickAnswer:
      "Mold on a bathroom ceiling or wall is a moisture problem, and it comes back until the moisture is fixed: usually shower steam that isn't vented out, a weak exhaust fan, a cold spot under the attic, or a leak. Patches under about 10 square feet are a DIY cleanup with detergent and water, gloves, goggles and an N-95 mask, for under $50. If it's bigger, keeps coming back, smells musty or comes with water damage, call a pro: professional mold cleanup in a bathroom typically runs $500 to $3,000 or more.",
    severity: "fix_soon",
    severityNote:
      "A small patch from shower steam isn't an emergency, but it spreads until you fix the moisture. It's more serious if it covers a large area, keeps returning, or comes with a leak or soft drywall.",
    verdict: "diy",
    verdictNote:
      "Cleaning a small patch and improving ventilation are DIY. Large areas, mold inside walls or ceilings, and a new vented exhaust fan are for a pro.",
    safety: [
      "The mold covers more than about 10 square feet, roughly a 3-by-3-foot patch: the EPA suggests professional help at that size.",
      "The ceiling is soft, sagging or stained from a leak: keep people out from under a sagging area and call a pro. Wet drywall can hold water and give way.",
      "Anyone in the house has asthma, allergies or a weakened immune system, or feels sick around the mold: have someone else do the cleanup, or hire a pro.",
    ],
    causes: [
      {
        cause: "Shower steam with poor ventilation",
        howToTell: "Spots on the ceiling above the shower and in the corners. The mirror stays fogged long after a shower.",
        fix: "Run the exhaust fan during showers and for 20 to 30 minutes after, or open a window. Clean the spots.",
      },
      {
        cause: "Weak or undersized exhaust fan",
        howToTell:
          "A tissue held to the fan grille doesn't stay there, or the fan is loud but moves little air.",
        fix: "Clean the grille and fan. If it's still weak, replace it with one sized for the room: about 1 CFM per square foot of floor, and at least 50 CFM.",
      },
      {
        cause: "Fan venting into the attic",
        howToTell: "Mold, moisture or frost in the attic near the bathroom, or a duct that ends in the insulation.",
        fix: "Run the duct to a roof or wall cap outside. Venting into the attic moves the mold problem up there.",
      },
      {
        cause: "Cold spot from missing insulation",
        howToTell:
          "A patch or line of mold on a ceiling under the attic, often near an outside wall, that comes back every winter.",
        fix: "Add or fix the attic insulation above the spot so the ceiling stays warm enough to stay dry.",
      },
      {
        cause: "A leak",
        howToTell:
          "Mold with a water stain, soft or bubbling drywall, or peeling paint, often under a roof, a toilet or a bathroom upstairs.",
        fix: "Find and fix the leak first. Drywall that stayed wet usually has to be cut out and replaced.",
      },
      {
        cause: "Failed caulk or grout",
        howToTell: "Dark mold in the caulk and grout lines of the tub or shower that won't scrub out.",
        fix: "Cut out the old caulk, let the joint dry fully, and re-caulk with a mildew-resistant silicone.",
      },
    ],
    tryFirst: [
      "Measure the patch. Under about 10 square feet is a DIY job. Bigger than that, call a pro.",
      "Open a window or run the fan, and wear rubber gloves, goggles and an N-95 mask.",
      "Scrub painted surfaces, tile and grout with detergent and water or a mold-and-mildew cleaner, then dry the area completely.",
      "If you use bleach, use no more than 1 cup per gallon of water, and never mix it with ammonia or other cleaners.",
      "Run the exhaust fan during every shower and for 20 to 30 minutes after. Hold a tissue to the grille: the fan should hold it there.",
    ],
    callAPro: [
      "The mold covers more than about 10 square feet.",
      "It keeps coming back after cleaning and better ventilation.",
      "There's a musty smell, soft drywall, peeling paint or other signs of a leak.",
      "You need a new exhaust fan or a duct run to the outside.",
    ],
    costs: [
      { job: "Clean, prime and repaint a small area", diy: "$30–$80", pro: "$150–$450" },
      { job: "Re-caulk a tub or shower", diy: "$10–$25", pro: "$150–$350" },
      { job: "Replace an exhaust fan (existing wiring and duct)", diy: "$40–$200", pro: "$200–$600" },
      { job: "Install a new exhaust fan vented outside", diy: "Not recommended", pro: "$400–$1,200" },
      { job: "Professional mold remediation (bathroom)", diy: "—", pro: "$500–$3,000+" },
    ],
    tellThePro:
      "I have mold on my bathroom [ceiling / walls / caulk and grout], about [size]. It [is new / came back after cleaning]. The exhaust fan [works well / is weak / vents into the attic / isn't there]. I [have / haven't] noticed a leak, soft drywall or a musty smell. The bathroom is [under the attic / under another bathroom / on an outside wall]. Can you tell me what's causing it and quote fixing the cause, not just the cleanup?",
    faqs: [
      {
        q: "Can I just paint over bathroom mold?",
        a: "No. The EPA advises against painting over mold, because paint on a moldy surface is likely to peel. Clean it, fix the moisture, let it dry completely, then use a stain-blocking primer and a mildew-resistant bathroom paint.",
      },
      {
        q: "Should I use bleach on bathroom mold?",
        a: "You don't need it. The EPA says detergent and water work on hard surfaces. If you do use bleach, dilute it, ventilate the room, and never mix it with ammonia or other cleaners: the combination releases toxic gas.",
      },
      {
        q: "Is black mold in the bathroom dangerous?",
        a: "You can't tell the type of mold by its color, and testing usually isn't needed. Any mold can cause allergy symptoms or asthma flare-ups in some people. Clean small patches promptly, and keep anyone with asthma, allergies or a weakened immune system out of the room while you do.",
      },
      {
        q: "How do I stop mold from coming back in the bathroom?",
        a: "Control the moisture. Run a properly sized fan that vents outside during every shower and for 20 to 30 minutes after, wipe down the shower, and fix leaks and failed caulk quickly. The EPA recommends keeping indoor humidity below 60 percent, ideally 30 to 50 percent.",
      },
    ],
  },
  {
    slug: "dishwasher-not-draining",
    title: "Dishwasher not draining: clear the filter, drain path and pump",
    metaTitle: "Dishwasher Not Draining? 6 Causes, Fixes and Repair Costs",
    metaDescription:
      "Water in the bottom of the dishwasher? Clean the filter, run the disposal, clear the air gap and hose, spot a bad drain pump, and see what a tech charges.",
    symptom: "Dishwasher not draining",
    category: "appliances",
    reviewed: "2026-09-28",
    quickAnswer:
      "Standing water in a dishwasher usually means a clogged filter, a garbage disposal that's full or still has its knockout plug in, a clogged air gap, or a kinked drain hose. Run the disposal for 20 to 30 seconds first, since the dishwasher drains into it, then clean the filter under the lower spray arm and the air gap cap by the faucet. If the pump hums or stays silent and nothing drains, the drain pump has likely failed, typically $200 to $450 for an appliance tech to replace.",
    severity: "fix_soon",
    severityNote:
      "Not dangerous, but the water turns sour within a day or two and a blocked drain can back up into the sink. It's more pressing if water reaches the floor or the wiring under the kick panel.",
    verdict: "diy",
    verdictNote:
      "Running the disposal, cleaning the filter and the air gap, and knocking out a disposal plug are DIY with a screwdriver. Pulling the dishwasher out to reach the hose, or replacing the drain pump, is a job for a handy homeowner or an appliance tech.",
    safety: [
      "You need to bail out water, pull the filter or reach into the sump: unplug the dishwasher or switch off its breaker first, and wear gloves. Broken glass often collects in the sump.",
      "A cycle just ended: let the water cool for 20 to 30 minutes before you reach in. Wash and sanitize water can be hot enough to scald.",
      "Water is leaking onto the floor or under the kick panel, where the wiring connects: switch off the breaker before you mop up or take the panel off.",
      "Burning smell or smoke from under the dishwasher: switch it off at the breaker and don't run it again until it's checked.",
    ],
    causes: [
      {
        cause: "Clogged filter",
        howToTell:
          "Dirty water sits over the filter in the floor of the tub, bits of food are left on dishes, and there's a sour smell. Most newer dishwashers have a filter you clean by hand.",
        fix: "Twist the filter out, usually a quarter turn counterclockwise, and scrub it in the sink with a soft brush and warm soapy water. Wipe out the sump and lock the filter back in. Clean it every month or so.",
      },
      {
        cause: "Full garbage disposal or clogged sink drain",
        howToTell:
          "The sink drains slowly, or water rises in the sink when the dishwasher drains. On a sink without a disposal, the hose connects to a branch fitting under the sink that can clog with grease.",
        fix: "Run the disposal with cold water for 20 to 30 seconds before every load. If the sink itself is slow, clear the trap or snake the drain first: the dishwasher can't drain into a blocked line. Skip chemical drain cleaners.",
      },
      {
        cause: "Clogged air gap or no high loop",
        howToTell:
          "Water spurts out of the small chrome or plastic cap next to the faucet when the dishwasher drains. With no air gap, the drain hose under the sink lies flat on the cabinet floor instead of looping up.",
        fix: "Pull the air gap cover off, unscrew the cap underneath and clear the gunk with a bottle brush. With no air gap, fasten the hose as high as it will go under the counter (a high loop) so sink water can't run back into the dishwasher.",
      },
      {
        cause: "Knockout plug left in a new disposal",
        howToTell: "The dishwasher stopped draining right after a new garbage disposal was put in.",
        fix: "With the disposal unplugged, take the dishwasher hose off the inlet on the side of the disposal, tap the plastic plug out with a screwdriver and hammer, and fish it out of the disposal with tongs.",
      },
      {
        cause: "Kinked or clogged drain hose",
        howToTell:
          "The filter, disposal and air gap are clear but water still sits. Often right after the dishwasher was installed or pushed back into the cabinet.",
        fix: "Straighten a kink, or replace a crushed hose. To check for a clog, take the hose off at the disposal or sink end over a bucket and run a Drain cycle. If water pumps out freely, the blockage is past the hose.",
      },
      {
        cause: "Failed drain pump or stuck check valve",
        howToTell:
          "At the drain step you hear a hum with no water moving, grinding or rattling, or nothing at all. The display may show a drain error.",
        fix: "With the power off, pull the filter and look in the sump for glass, fruit pits or bones near the pump. On some models a small cover pops off so you can clear the impeller. A pump that still won't run, or a check valve stuck shut, needs replacing.",
      },
    ],
    tryFirst: [
      "Run the garbage disposal with cold water for 20 to 30 seconds. Then press Cancel or Cancel/Drain on the dishwasher and listen for a couple of minutes.",
      "If water still sits, let it cool, then unplug the dishwasher or switch off its breaker. Put towels down and bail the water into a bucket with a cup and a sponge.",
      "Twist out the filter, rinse it in the sink, and wipe out the sump with gloves on.",
      "If you have an air gap by the faucet, pull off its cover, unscrew the cap and clear any debris.",
      "Look under the sink: the drain hose should loop up high, not be kinked, and be clamped tight. If the disposal is new, check that the knockout plug was removed.",
      "Restore power, run the disposal again, and start a short Rinse or Drain cycle to test it.",
    ],
    callAPro: [
      "The pump hums, grinds or stays silent after you've cleaned the filter and cleared the drain path.",
      "Water leaks onto the floor or from under the kick panel.",
      "The sink drain is clogged past the trap and a hand snake won't clear it.",
      "A drain error code keeps coming back after a reset.",
    ],
    costs: [
      { job: "Appliance repair diagnostic visit", diy: "—", pro: "$75–$200" },
      { job: "Clean the filter and air gap", diy: "$0–$10", pro: "—" },
      { job: "Replace the drain hose", diy: "$15–$40", pro: "$150–$300" },
      { job: "Replace the drain pump", diy: "$40–$150", pro: "$200–$450" },
      { job: "Clear a clogged kitchen sink drain", diy: "$0–$50", pro: "$125–$350" },
      { job: "Replace a standard built-in dishwasher", diy: "$400–$1,200", pro: "$600–$1,800" },
    ],
    tellThePro:
      "My dishwasher, about [age] years old, leaves [a little / several inches of] water in the bottom after every cycle. It drains through [an air gap / a high loop] into [a garbage disposal / the sink drain]. I've [run the disposal / cleaned the filter / cleared the air gap / checked the hose for kinks] and it still won't drain. At the drain step I hear [a hum / grinding / nothing], and the display shows [error code / no code]. Is it worth repairing at this age, and does your price include the part and labor?",
    faqs: [
      {
        q: "Why is my dishwasher not draining?",
        a: "Usually a clogged filter, a garbage disposal that's full or still has its knockout plug in, a clogged air gap, or a kinked drain hose. Run the disposal, then clean the filter and the air gap first. If it still won't drain and you hear a hum or nothing at the drain step, the drain pump has likely failed.",
      },
      {
        q: "Why won't my dishwasher drain after installing a new garbage disposal?",
        a: "The knockout plug was probably left in. New disposals come with a plastic plug sealing the dishwasher inlet, and it has to be knocked out before the dishwasher can drain. With the disposal unplugged, take off the dishwasher hose, tap the plug out with a screwdriver and hammer, and remove it from inside the disposal with tongs.",
      },
      {
        q: "Is it normal to have water in the bottom of the dishwasher?",
        a: "A small amount, yes. Many models keep a little clean water in the sump under the filter to keep the seals from drying out. Water that covers the floor of the tub, or is dirty and smells, means it isn't draining.",
      },
      {
        q: "How much does it cost to fix a dishwasher that won't drain?",
        a: "Often nothing, because cleaning the filter, the air gap and the disposal inlet fixes most cases. If a part has failed, a new drain hose typically costs $150 to $300 installed and a drain pump $200 to $450. On a dishwasher more than about 10 years old, weigh a pump replacement against a new unit.",
      },
    ],
  },
  {
    slug: "washing-machine-not-draining",
    title: "Washing machine not draining: how to empty it and find the cause",
    metaTitle: "Washing Machine Not Draining? 5 Causes, Fixes and Costs",
    metaDescription:
      "Washer full of water? How to drain it safely, clear the pump filter and hose, spot a bad lid switch or drain pump, and what a repair tech charges.",
    symptom: "Washing machine not draining",
    category: "appliances",
    reviewed: "2026-09-28",
    quickAnswer:
      "A washer that leaves water in the drum usually has a clogged drain pump filter, a kinked or clogged drain hose, a faulty lid switch or door lock, or a failed drain pump. Unplug it first. On a front-loader, drain the water through the small hose behind the bottom access panel into a shallow pan, then unscrew the filter and clear out socks, coins and lint. If the pump hums but won't pump, or the standpipe backs up, call a pro: a new drain pump typically costs $200 to $450 installed.",
    severity: "fix_soon",
    severityNote:
      "Not dangerous by itself, but wet clothes sour within a day and standing water starts to smell. It's more pressing if water is on the floor near the outlet or the standpipe overflows.",
    verdict: "diy_if_handy",
    verdictNote:
      "Draining the tub, clearing the pump filter and straightening or flushing the hose are DIY. Replacing a lid switch or drain pump is a handy job with a nut driver and pliers. A clogged house drain is for a plumber.",
    safety: [
      "You're about to drain it by hand, open the pump filter or pull the washer out: unplug it first. Water on the floor near a live outlet is a shock risk.",
      "Water is already on the floor around the outlet or cord: switch off the breaker from a dry spot before you touch the plug.",
      "Burning smell or smoke, or the motor hums and gets hot: unplug it or switch off the breaker, and don't run it again until it's checked.",
      "Water comes up in a floor drain, tub or toilet when the washer drains: stop using water and call a plumber. The main drain line may be clogged.",
    ],
    causes: [
      {
        cause: "Clogged drain pump filter",
        howToTell:
          "A front-loader holds water, the pump hums or runs, and the display may show a drain error. The filter, sometimes called a coin trap, is behind a small panel at the bottom front. Some top-loaders have one too.",
        fix: "Drain the water through the little hose behind the panel into a shallow pan, then unscrew the filter slowly and clear out socks, coins, hair and lint. Clean it every few months.",
      },
      {
        cause: "Kinked or clogged drain hose",
        howToTell:
          "The washer was recently moved or pushed back, and the hose is bent or flattened behind it. A small sock or a wad of lint can also lodge inside.",
        fix: "Straighten it, or replace it if it's crushed or cracked. With the washer unplugged, take the hose off over a bucket and flush it with a garden hose.",
      },
      {
        cause: "Lid switch or door lock",
        howToTell:
          "Top-loader: water stays in and the drum won't spin, even with the lid closed. You don't hear the usual click, or the plastic tab on the lid is broken. Front-loader: the door lock light blinks or the washer shows a door lock error.",
        fix: "Replace the lid switch or door lock assembly. Never bypass it: it's what stops the drum from spinning with the lid open.",
      },
      {
        cause: "Clogged standpipe or house drain",
        howToTell:
          "The washer pumps, but water backs up and overflows out of the standpipe or the laundry sink. Nearby drains may gurgle.",
        fix: "Clear the standpipe with a hand snake, and add a lint catcher if the washer empties into a laundry sink. If several drains are slow or water comes up in a floor drain, call a plumber.",
      },
      {
        cause: "Failed drain pump",
        howToTell:
          "The filter and hose are clear, but at the drain step you hear a hum with no water moving, grinding, or nothing at all.",
        fix: "Replace the pump. On many front-loaders it sits right behind the filter. On top-loaders it's at the bottom of the cabinet. An appliance tech usually does it in about an hour.",
      },
    ],
    tryFirst: [
      "Unplug the washer. If there's water on the floor near the outlet, switch off the breaker first.",
      "Don't force a front-loader door. It stays locked while there's water inside, and usually unlocks a couple of minutes after the water is out.",
      "Front-loader: open the small panel at the bottom front, put towels and a shallow pan down, and drain the water through the little hose. Expect to empty the pan several times.",
      "Then unscrew the pump filter slowly, clear out anything caught in it, and screw it back in firmly.",
      "Top-loader: bail the water into a bucket, or lower the drain hose into a bucket on the floor and let gravity empty the tub. Check the plastic tab on the lid isn't broken.",
      "Check the drain hose behind the washer for kinks, plug it back in, and run Drain and Spin with no clothes. Listen for the pump.",
    ],
    callAPro: [
      "The pump hums, grinds or stays silent with a clear filter and hose.",
      "The standpipe backs up, or water comes up in a floor drain or tub when the washer drains.",
      "Water leaks from under the washer.",
      "A lid switch or door lock error keeps coming back after a reset.",
    ],
    costs: [
      { job: "Appliance repair diagnostic visit", diy: "—", pro: "$75–$200" },
      { job: "Replace the drain hose", diy: "$10–$30", pro: "$100–$250" },
      { job: "Replace a lid switch or door lock", diy: "$25–$100", pro: "$150–$350" },
      { job: "Replace the drain pump", diy: "$40–$150", pro: "$200–$450" },
      { job: "Clear a clogged standpipe or laundry drain", diy: "$15–$50", pro: "$150–$400" },
    ],
    tellThePro:
      "My [top-load / front-load] washer, about [age] years old, leaves water in the drum [after every cycle / some of the time] and [won't spin / spins slowly]. At the drain step I hear [a hum / grinding / nothing]. The display shows [error code / no code]. I've [cleaned the pump filter / checked the hose for kinks / checked the standpipe], and the standpipe [drains fine / backs up]. What do you think has failed, and does your price include the part, labor and a warranty on the repair?",
    faqs: [
      {
        q: "Why won't my washing machine drain?",
        a: "The usual causes are a clogged drain pump filter, a kinked or clogged drain hose, a faulty lid switch or door lock, a clogged standpipe, or a failed drain pump. Check the hose and clean the pump filter first. If the pump hums or stays silent with everything clear, it likely needs replacing.",
      },
      {
        q: "How do I drain a washing machine full of water?",
        a: "Unplug it first. On a front-loader, open the small panel at the bottom front and let the water run out of the little drain hose into a shallow pan, emptying it as often as you need, before you unscrew the filter. On a top-loader, bail it into a bucket, or pull the drain hose out of the standpipe and lower it into a bucket on the floor so gravity empties the tub.",
      },
      {
        q: "Where is the drain pump filter on a washing machine?",
        a: "On most front-loaders it's behind a small panel at the bottom front corner, sometimes called a coin trap. Many top-loaders don't have one you can reach without opening the cabinet, so check the manual. Clean it every few months, or whenever the washer is slow to drain.",
      },
      {
        q: "How much does it cost to fix a washer that won't drain?",
        a: "Clearing a clogged filter or hose costs nothing but time. An appliance tech typically charges $200 to $450 to replace a drain pump and $150 to $350 for a lid switch or door lock. If the washer is more than about 10 years old and needs a bigger repair than that, replacing it often makes more sense.",
      },
    ],
  },
  {
    slug: "refrigerator-not-cooling",
    title: "Refrigerator not cooling: what to check and when it's worth fixing",
    metaTitle: "Refrigerator Not Cooling? 6 Causes, Costs and When to Replace",
    metaDescription:
      "Fridge warm but freezer cold? Check the settings, coils, fans, frost and door seals, keep your food safe, and see what repairs cost and when to replace it.",
    symptom: "Refrigerator not cooling",
    category: "appliances",
    reviewed: "2026-09-28",
    quickAnswer:
      "A refrigerator that isn't cooling usually has dirty condenser coils, a failed condenser or evaporator fan, a frosted-over evaporator from a defrost failure, or leaky door seals. If the freezer is cold but the fridge is warm, suspect the evaporator fan or frost. Check the temperature setting, then unplug it and vacuum the coils. Fan and defrost repairs typically run $150 to $450. A compressor or refrigerant repair needs an EPA-certified tech and costs $500 to $1,500 or more, rarely worth it on a fridge over about 10 years old.",
    severity: "urgent",
    severityNote:
      "Food starts to spoil once the fridge is above 40°F, so deal with it today. It gets worse fast in a hot kitchen or when the doors are opened a lot.",
    verdict: "diy_if_handy",
    verdictNote:
      "Checking settings, cleaning coils and door seals, and a manual defrost are DIY. Swapping a fan motor or start relay is a handy job on many models. Anything involving refrigerant or the compressor needs an EPA-certified tech.",
    safety: [
      "A thermometer in the fridge reads above 40°F: move perishables to a cooler with ice. Throw out meat, poultry, seafood, milk, eggs and leftovers that have been above 40°F for 2 hours or more, and don't taste food to check it.",
      "Before you clean the coils or touch a fan: unplug the fridge. Fans can start without warning, and the compressor area has live wiring.",
      "Burning smell, or a scorched plug or outlet: unplug the fridge, or switch off the breaker if you can't reach the plug, and don't use it until it's checked.",
      "Hissing from the tubing, an oily spot near the compressor, or a chemical smell: unplug it, air out the room and keep flames and sparks away. Many newer fridges use a flammable refrigerant (the rating plate says which). Call an EPA-certified tech.",
    ],
    causes: [
      {
        cause: "Temperature control set wrong",
        howToTell:
          "The dial or display got bumped warmer or to Off, or the lights and display work but nothing cools (Demo or Showroom mode on some digital models). A fridge that was just delivered or moved can take up to 24 hours to get fully cold.",
        fix: "Set the fridge to about 37°F, or the middle of the dial, and the freezer to 0°F, then give it 24 hours. The manual explains how to turn off Demo mode.",
      },
      {
        cause: "Dirty condenser coils or a stopped condenser fan",
        howToTell:
          "The coils under the front grille or on the back are furred with dust and pet hair. The fridge runs nonstop and its sides feel hot. On models with coils underneath, little or no warm air blows out under the front grille.",
        fix: "Unplug it, then clean the coils with a coil brush and a vacuum. If the small fan next to the compressor at the bottom back won't spin, it needs a new motor.",
      },
      {
        cause: "Leaky door seals",
        howToTell:
          "A gasket is torn, flattened or pulling away. A dollar bill closed in the door slides out with no drag. The door doesn't swing shut by itself, or food keeps it from closing.",
        fix: "Clean the gasket with warm soapy water, move whatever blocks the door, and adjust the front legs so the fridge tilts back slightly. Replace a torn gasket.",
      },
      {
        cause: "Failed evaporator fan or blocked vents",
        howToTell:
          "The freezer is cold but the fridge is warm. With the compressor running, open the freezer and press the door switch: you don't hear or feel the fan behind the back wall, or it squeals.",
        fix: "Move food away from the vents between the freezer and the fridge. A silent or noisy fan needs a new motor, which sits behind the freezer's back panel on most models.",
      },
      {
        cause: "Frost-blocked evaporator (defrost failure)",
        howToTell:
          "Thick frost or ice on the freezer's back wall or vents. The fridge warmed up gradually over days, and the freezer may be getting warmer too.",
        fix: "Empty it, unplug it and leave the doors open for 24 to 48 hours with towels down. Never chip the ice with a knife: a punctured tube ruins the fridge. If it frosts up again within a few weeks, the defrost heater, thermostat or control needs replacing.",
      },
      {
        cause: "Start relay or compressor",
        howToTell:
          "A click from the bottom back every few minutes, a short hum, then silence. The lights and fans work but nothing gets cold, and the compressor feels hot.",
        fix: "The start relay on the side of the compressor is a cheap part and often the culprit. If a new relay doesn't help, the compressor has failed. That's sealed-system work for an EPA-certified tech, and often not worth it on an older fridge.",
      },
    ],
    tryFirst: [
      "Put an appliance thermometer on the middle shelf and check it after a few hours. Above 40°F, move meat, dairy and leftovers to a cooler with ice, and keep the doors shut.",
      "Check the controls: fridge about 37°F, freezer 0°F, and not in Demo or Showroom mode.",
      "Unplug the fridge, take off the grille at the bottom front (or pull it out if the coils are on the back) and clean the coils with a coil brush and a vacuum.",
      "Make sure food isn't blocking the vents in the freezer or fridge, and do the dollar-bill test on the door seals.",
      "If there's thick frost on the freezer's back wall, empty it, unplug it and leave the doors open for 24 hours or more with towels down.",
      "Plug it back in and listen: the compressor should hum steadily. Clicking every few minutes points to the start relay or compressor.",
    ],
    callAPro: [
      "The freezer is cold but the fridge stays warm after you've cleaned the coils and cleared the vents.",
      "Frost builds up again within weeks of a manual defrost.",
      "The compressor clicks on and off without running, or stays silent while the lights work.",
      "You suspect a refrigerant leak. Sealed-system work requires EPA certification.",
    ],
    costs: [
      { job: "Appliance repair diagnostic visit", diy: "—", pro: "$75–$200" },
      { job: "Clean condenser coils", diy: "$10–$25", pro: "$100–$200" },
      { job: "Replace condenser or evaporator fan motor", diy: "$30–$100", pro: "$150–$400" },
      { job: "Repair the defrost system (heater, thermostat or control)", diy: "$20–$100", pro: "$150–$450" },
      { job: "Replace start relay", diy: "$15–$60", pro: "$150–$300" },
      { job: "Sealed-system repair (compressor or refrigerant leak)", diy: "Not allowed", pro: "$500–$1,500+" },
    ],
    tellThePro:
      "My [top-freezer / bottom-freezer / side-by-side / French-door] refrigerator, about [age] years old, isn't cooling. The fridge reads [temperature] and the freezer is [still cold / also warm]. I [do / don't] hear the fan in the freezer, the compressor [runs / clicks on and off / is silent], and there [is / isn't] frost on the freezer's back wall. I've [checked the settings / cleaned the coils / defrosted it]. Given its age, is it worth repairing, and if it's the compressor or a leak, what would the full repair cost, with warranty?",
    faqs: [
      {
        q: "Why is my freezer cold but my fridge warm?",
        a: "Usually the evaporator fan has stopped or the evaporator coil is blocked with frost. Both sit behind the back wall of the freezer, and cold air can't reach the fridge without them. Make sure food isn't blocking the vents, then listen for the fan. A fan motor or defrost repair typically costs $150 to $450 installed.",
      },
      {
        q: "How long is food safe in a refrigerator that stopped cooling?",
        a: "About 4 hours if you keep the door closed, according to the USDA. Throw out perishables like meat, poultry, seafood, milk, eggs and leftovers that have been above 40°F for 2 hours or more. A full freezer holds its temperature for about 48 hours, or 24 if it's half full, as long as the door stays shut.",
      },
      {
        q: "Is it worth fixing a refrigerator that's not cooling?",
        a: "Usually yes if it's a fan, start relay, door gasket or defrost part, which typically cost $150 to $450 installed at almost any age. A compressor or refrigerant leak at $500 to $1,500 or more is rarely worth it on a fridge older than about 10 years. On a newer one, check the warranty first: many manufacturers cover the sealed system longer than the rest of the fridge. A common rule of thumb is to replace when the repair costs more than half the price of a comparable new fridge.",
      },
      {
        q: "Can I recharge the refrigerant in my fridge myself?",
        a: "No. Handling refrigerant requires EPA certification, and a household fridge has no service ports for topping it up. Low refrigerant always means a leak, so a tech has to find and fix it, then evacuate and recharge the system.",
      },
    ],
  },
  {
    slug: "dryer-not-heating",
    title: "Dryer not heating: check the vent first, then the parts",
    metaTitle: "Dryer Not Heating? 5 Causes, Fixes and Repair Costs",
    metaDescription:
      "Dryer tumbling but not heating? Clean the vent first, then check the breaker, thermal fuse, heating element or gas igniter. Fire risks and repair costs.",
    symptom: "Dryer not heating",
    category: "appliances",
    reviewed: "2026-09-28",
    quickAnswer:
      "A dryer that tumbles but won't heat most often has a clogged lint screen or vent, or a thermal fuse that blew because the vent was clogged. Electric dryers also lose heat when a heating element fails or when half of the 240-volt circuit loses power. On gas dryers, the usual suspects are the igniter and the gas valve coils. Clean the lint screen and vent first, because a clogged vent is also a fire hazard. Most of these repairs typically cost $100 to $400 from an appliance tech.",
    severity: "fix_soon",
    severityNote:
      "A dryer with no heat isn't dangerous by itself, but the most common cause, a clogged vent, is a fire risk. Clean the vent before you run it with heat again. It's 'stop and call a pro now' if you smell burning or gas.",
    verdict: "diy_if_handy",
    verdictNote:
      "Cleaning the lint screen and vent and resetting the breaker are DIY. Testing and replacing a thermal fuse or heating element is a handy job with a multimeter and a nut driver. Gas valve coils and igniters are best left to an appliance tech, and anything that means disconnecting the gas line is a pro job.",
    safety: [
      "Burning smell, smoke, or the dryer or vent is too hot to touch: turn it off, unplug it or switch off the breaker, and don't run it until the vent and dryer are checked.",
      "Flames or smoke inside the drum: keep the door closed, get everyone out and call 911 from outside.",
      "Gas dryer and you smell gas or rotten eggs: don't touch switches or unplug anything. Leave the house and call your gas utility or 911 from outside.",
      "The vent is plastic or foil accordion duct, or it's crushed or disconnected: stop using the dryer until it's replaced with rigid or semi-rigid metal duct. On a gas dryer, a disconnected vent can also push carbon monoxide into the house.",
    ],
    causes: [
      {
        cause: "Clogged lint screen or vent",
        howToTell:
          "Loads take two or three cycles to dry, the laundry room gets hot and humid, and little air comes out of the outside vent hood. Lint collects behind the dryer or around the door.",
        fix: "Clean the lint screen every load, and scrub it with a soft brush and dish soap if water pools on it. Clean the whole vent at least once a year, and replace plastic or foil duct with metal.",
      },
      {
        cause: "Blown thermal fuse",
        howToTell:
          "The drum turns but there's no heat at all, often after a stretch of long drying times. On some models a blown fuse stops the dryer completely.",
        fix: "With the dryer unplugged, test the fuse on the exhaust duct or blower housing with a multimeter and replace it if it has no continuity. Clean the vent too: fuses blow because the dryer overheated, and a new one will blow again. Never bypass it.",
      },
      {
        cause: "Half the 240-volt circuit is down (electric)",
        howToTell:
          "An electric dryer tumbles but gives no heat at all. The motor runs on one half of the 240-volt circuit, but the element needs both halves, so a partly tripped or failing double-pole breaker, one blown fuse in an older fuse box, or a loose wire at the cord can cut the heat.",
        fix: "Switch the double-pole breaker (usually 30 amps) fully off, then back on. If the heat doesn't come back, or it trips again, have an electrician check the breaker, outlet and cord.",
      },
      {
        cause: "Failed heating element (electric)",
        howToTell:
          "The breaker, thermal fuse and vent all check out, but there's still no heat. The coil may be visibly broken.",
        fix: "With the dryer unplugged, test the element for continuity. A broken coil means a new element. Many come with a new high-limit thermostat, and it's worth replacing both.",
      },
      {
        cause: "Gas valve coils or igniter (gas)",
        howToTell:
          "On a gas dryer, the igniter glows, then goes dark without the burner lighting, or the flame lights and goes out: usually the gas valve coils. If the igniter never glows, the igniter or the flame sensor is the likely culprit.",
        fix: "Check that the gas shutoff behind the dryer is open, with the handle in line with the pipe. Coils and igniters are common, inexpensive parts, but it's work on a gas appliance: have an appliance tech do it unless you're experienced.",
      },
    ],
    tryFirst: [
      "Check the setting. Air Fluff, Air Dry and other no-heat settings tumble without heat.",
      "Clean the lint screen. If water pools on it under the tap, scrub it with a soft brush and dish soap.",
      "Run the dryer and check the outside vent hood: the flap should open and you should feel strong airflow. Weak airflow means a clogged vent.",
      "Electric: switch the dryer's double-pole breaker fully off, then back on.",
      "Gas: make sure the shutoff valve on the pipe behind the dryer is open, with the handle in line with the pipe.",
      "Unplug the dryer (and turn off the gas on a gas dryer), pull it out and clean the duct and vent with a vent brush kit. Replace plastic or foil duct with metal.",
    ],
    callAPro: [
      "Still no heat after you've cleaned the vent and reset the breaker.",
      "The thermal fuse blows again after a vent cleaning.",
      "A gas dryer's burner won't light, or you smell gas.",
      "The breaker trips again, or you see scorch marks at the outlet, cord or the cord's terminal block.",
      "The vent runs through the roof, a long run or inside walls you can't reach.",
    ],
    costs: [
      { job: "Appliance repair diagnostic visit", diy: "—", pro: "$75–$200" },
      { job: "Clean the dryer vent", diy: "$15–$40", pro: "$100–$250" },
      { job: "Replace plastic or foil duct with metal", diy: "$15–$50", pro: "$100–$250" },
      { job: "Replace thermal fuse", diy: "$10–$30", pro: "$100–$250" },
      { job: "Replace heating element (electric)", diy: "$30–$100", pro: "$150–$400" },
      { job: "Replace gas valve coils or igniter (gas)", diy: "Not recommended", pro: "$150–$400" },
    ],
    tellThePro:
      "My [electric / gas] dryer, about [age] years old, tumbles but [doesn't heat at all / only gets a little warm]. Loads [had been taking longer to dry / dried normally until now]. I've cleaned the lint screen and [cleaned the vent / checked the airflow at the outside hood / reset the breaker / checked the gas valve is open]. The vent is [rigid metal / semi-rigid metal / foil or plastic] and runs about [length] to [an outside wall / the roof]. Can you find the cause before replacing parts, and does your price include cleaning the vent if it's clogged?",
    faqs: [
      {
        q: "Why is my dryer running but not heating?",
        a: "The most common cause is a clogged lint screen or vent, often with a thermal fuse that blew because the dryer overheated. On an electric dryer, a failed heating element or half of the 240-volt circuit losing power also stops the heat. On a gas dryer, look at the igniter and the gas valve coils.",
      },
      {
        q: "Can a clogged dryer vent stop a dryer from heating?",
        a: "Yes. A clogged vent traps hot air, so the dryer overheats and its safety thermostats cut the heat or the thermal fuse blows. It's also a fire risk. Clean the lint screen every load and the whole vent at least once a year.",
      },
      {
        q: "How much does it cost to fix a dryer that's not heating?",
        a: "Most repairs are small. A thermal fuse typically costs $100 to $250 installed, and a heating element, gas valve coils or igniter $150 to $400. A professional vent cleaning runs about $100 to $250, and it's often the real fix.",
      },
      {
        q: "Is it safe to use a dryer with a foil or plastic vent?",
        a: "No. Plastic and thin foil accordion duct sags, crushes and traps lint, which raises the risk of a fire. Most dryer makers call for rigid or semi-rigid metal duct, kept as short and straight as you can. Never vent a dryer into an attic, crawl space or wall cavity.",
      },
    ],
  },
  {
    slug: "roof-leaking",
    title: "Roof leaking: what to do right now and what's causing it",
    metaTitle: "Roof Leaking? What to Do Now, Causes and Repair Costs",
    metaDescription:
      "Roof leaking in the rain? What to do inside right now, the usual causes (flashing, pipe boots, shingles, ice dams), and what a roofer charges to fix it.",
    symptom: "Roof leaking",
    category: "roof_gutters",
    reviewed: "2026-09-28",
    quickAnswer:
      "Most roof leaks start where something passes through the roof: the flashing around a chimney, vent or skylight, or a cracked rubber boot around a plumbing vent pipe. Missing shingles, clogged gutters and valleys, and winter ice dams come next. Right now, catch the water, move valuables, switch off power to any wet light fixture, and take photos. Leave the roof itself to a roofer: most leak repairs run $400 to $1,500, and an emergency tarp typically costs $200 to $1,000.",
    severity: "urgent",
    severityNote:
      "Every rain soaks more insulation, drywall and framing, and wet materials can start growing mold within 24 to 48 hours. It's 'stop and call a pro now' if the ceiling sags or water reaches a light fixture or outlet.",
    verdict: "call_pro",
    verdictNote:
      "Catching the water, draining a small ceiling bulge, taking photos and checking the attic are DIY. Anything on the roof itself, including emergency tarping, flashing and shingle repairs, is a roofer's job.",
    safety: [
      "Water is dripping from or near a light fixture, ceiling fan or outlet: switch that circuit off at the breaker and don't touch the fixture.",
      "A large area of ceiling sags, cracks or pulls away: leave the room, keep everyone out from under it, and call a pro. Only drain a small, local bulge yourself.",
      "The roof is wet, icy or steep, or there's wind or lightning: never climb onto it. Check from the ground and the attic, and let a roofer do the tarping.",
    ],
    causes: [
      {
        cause: "Flashing around a chimney, vent or skylight",
        howToTell:
          "The stain or drip is near a chimney, skylight, or a wall where the roof meets siding. From the ground or the attic you may see rusted, lifted or gapped metal, or cracked caulk.",
        fix: "A roofer reseals or replaces the flashing. Caulk alone is a short-term patch.",
      },
      {
        cause: "Failed pipe boot (vent pipe collar)",
        howToTell:
          "A drip or stain right below a plumbing vent pipe, often near a bathroom. In the attic, the wood around the pipe is wet or dark. On the roof, the rubber collar at the base of the pipe is cracked from sun.",
        fix: "A roofer replaces the boot or fits a rubber repair sleeve over it. It's one of the cheaper roof repairs.",
      },
      {
        cause: "Missing or damaged shingles",
        howToTell:
          "The leak started after wind or hail. From the ground you see bare patches, lifted or creased shingles, or shingle pieces in the yard.",
        fix: "A roofer replaces the damaged shingles. On an old roof with widespread damage, replacement may make more sense.",
      },
      {
        cause: "Clogged gutters or roof valleys",
        howToTell:
          "Water shows up at the top of an exterior wall or along the eaves in heavy rain. Gutters overflow, or leaves pile up in the valley where two roof slopes meet.",
        fix: "Clean the gutters and valleys. If it still leaks, a roofer checks the underlayment at the eave or in the valley.",
      },
      {
        cause: "Ice dams (winter)",
        howToTell:
          "In freezing weather, a ridge of ice and icicles builds up at the roof edge, and water appears near exterior walls on the top floor, often on sunny days with no rain.",
        fix: "Pull snow off the lower few feet of the roof with a roof rake from the ground, and have a pro steam the ice off. Never chip at it. Long term, air sealing, attic insulation and ventilation keep the roof edge cold.",
      },
      {
        cause: "Attic condensation (not a roof leak)",
        howToTell:
          "Frost or droplets on the underside of the roof deck and on nail tips in cold weather, damp insulation spread over a wide area, and drips on dry days instead of during rain.",
        fix: "Improve attic ventilation, air-seal the ceiling below, and make sure bath fans and the dryer vent outside, not into the attic. An insulation contractor or energy auditor fixes this, not a roofer.",
      },
    ],
    tryFirst: [
      "If water is near a light fixture, ceiling fan or outlet, switch that circuit off at the breaker first.",
      "Put a bucket or trash can under the drip and move furniture, electronics and valuables away. Cover what can't move with plastic sheeting.",
      "If the ceiling bulges with water, put on eye protection, set a bucket under the lowest point, stand to one side, and poke a small hole there with a screwdriver. It drains in a controlled stream instead of letting go all at once.",
      "Take dated photos and video of the ceiling, the wet areas and anything damaged before you clean up. Your insurer will want them.",
      "Once it's safe, check the attic with a flashlight, stepping only on the joists. Note what's above the wet spot: a chimney, vent pipe, skylight, valley or the eaves.",
      "Call a roofer for an emergency tarp, and run fans once the drip stops to dry things out within 24 to 48 hours.",
    ],
    callAPro: [
      "Water comes in during rain, even a slow drip. A roofer should tarp or repair it before the next storm.",
      "The ceiling sags, or water is near wiring or fixtures.",
      "You find wet or dark wood, soft sheathing or mold in the attic.",
      "The leak comes back after a patch, or the roof is near the end of its life.",
      "Ice dams form every winter.",
    ],
    costs: [
      { job: "Emergency roof tarp", diy: "Not recommended", pro: "$200–$1,000" },
      { job: "Replace a pipe boot", diy: "Not recommended", pro: "$150–$450" },
      { job: "Repair flashing at a chimney, vent or skylight", diy: "Not recommended", pro: "$300–$1,500" },
      { job: "Replace a few damaged shingles", diy: "Not recommended", pro: "$250–$750" },
      { job: "Patch and repaint a water-damaged ceiling", diy: "$30–$75", pro: "$250–$800" },
      { job: "Replace an asphalt shingle roof (typical house)", diy: "Not recommended", pro: "$8,000–$25,000" },
    ],
    tellThePro:
      "Water is coming through my [top-floor ceiling / attic / skylight / wall] during [heavy rain / wind-driven rain / snowmelt]. In the attic, the wet spot is near [the chimney / a vent pipe / a skylight / a valley / the eaves]. The roof is [asphalt shingle / metal / tile / flat], about [age] years old, on a [one / two]-story house. I've [caught the water / drained the ceiling / taken photos]. Can you tarp it before the next rain, and will your written quote say what caused the leak so I can give it to my insurer? What warranty comes with the repair?",
    faqs: [
      {
        q: "What should I do if my roof is leaking during a storm?",
        a: "Catch the water, move valuables, and switch off the breaker for any wet light fixture or outlet. If the ceiling is bulging, set a bucket under it and poke a small hole at the lowest point so it drains instead of collapsing. Take photos for your insurer and call a roofer to tarp it. Don't go up on the roof yourself in rain, wind or ice.",
      },
      {
        q: "Does homeowners insurance cover a leaking roof?",
        a: "Usually when the leak comes from sudden damage, like wind tearing off shingles or a falling limb, and usually not when it comes from age, wear or skipped maintenance. Policies differ, so read yours and call your insurer soon after the damage. Take photos, keep receipts for tarping and drying, and make reasonable temporary repairs, since most policies expect you to prevent further damage.",
      },
      {
        q: "How much does it cost to fix a roof leak?",
        a: "Most roof leak repairs cost $400 to $1,500, depending on the cause and how hard the roof is to work on. A cracked pipe boot is at the low end, usually $150 to $450, while chimney flashing or rotted decking costs more. An emergency tarp typically runs $200 to $1,000.",
      },
      {
        q: "How do I tell a roof leak from attic condensation?",
        a: "A roof leak shows up during or right after rain, in one spot, usually below a chimney, vent, skylight or valley. Condensation shows up in cold weather as frost or droplets spread across the underside of the roof deck and on nail tips, often on dry days. Condensation is fixed with ventilation and air sealing, not roof repairs.",
      },
    ],
  },
  {
    slug: "gutters-overflowing",
    title: "Gutters overflowing in the rain: why it happens and how to fix it",
    metaTitle: "Gutters Overflowing in Rain? 5 Causes, Fixes and Costs",
    metaDescription:
      "Gutters spilling over? Usually clogged gutters or downspouts, sometimes sagging, bad pitch or undersized gutters. How to fix each, and what a pro charges.",
    symptom: "Gutters overflowing",
    category: "roof_gutters",
    reviewed: "2026-09-28",
    quickAnswer:
      "Gutters that overflow in the rain are usually clogged: leaves, needles or shingle grit in the gutter, or a blocked downspout. If they're clean and still spill over, the gutter is probably sagging or sloped the wrong way, or too small for the water coming off the roof, often below a roof valley. Cleaning a single-story house from a ladder is a DIY job. Pros typically charge $100 to $250 to clean a one-story house and $150 to $450 for two stories. Water dumping next to the house can end up in the basement, so don't put it off.",
    severity: "fix_soon",
    severityNote:
      "Not an emergency, but water spilling next to the house soaks the soil at the foundation and can lead to basement leaks, rotted fascia and washed-out beds. Worse if water pools against the foundation or the basement is already damp.",
    verdict: "diy_if_handy",
    verdictNote:
      "Cleaning gutters and downspouts on a single-story house, adding downspout extensions, and re-hanging a short sagging section are DIY. Two-story gutters, re-pitching long runs, and replacing or upsizing gutters are for a gutter contractor.",
    safety: [
      "The gutters are on a second story or higher, or reaching them means standing on the roof: don't. Hire a gutter cleaner or gutter contractor.",
      "Overhead power lines run near the gutters or where the ladder would go: keep yourself and the ladder at least 10 feet away, and call a pro.",
      "The ground is wet, soft or sloped, or it's windy or raining: don't set up a ladder. Wait for a dry, calm day, and never lean a ladder on the gutter itself.",
    ],
    causes: [
      {
        cause: "Clogged gutters",
        howToTell:
          "Water spills over the front edge along a stretch of gutter, often under trees. From a ladder you see leaves, needles, shingle grit or even plants growing in the trough.",
        fix: "Scoop out the debris, then flush the gutter with a hose toward the downspout. Most homes need cleaning once or twice a year, more under pines or oaks.",
      },
      {
        cause: "Clogged downspout",
        howToTell:
          "Water overflows near the downspout while little or nothing comes out the bottom, and the gutter stays full after the rain stops.",
        fix: "Clear the top opening, then run a hose down it at full pressure or feed a plumber's snake up from the bottom. If it drains into a buried pipe that's blocked, a pro can clear or replace it.",
      },
      {
        cause: "Sagging gutter or wrong pitch",
        howToTell:
          "Water stands in the gutter a day after rain, or spills at one low spot away from the downspout. Hangers are loose, bent or pulling out of the fascia board.",
        fix: "Replace loose spikes with screw-in hidden hangers about every 2 feet, and re-pitch the run so it falls about 1/4 to 1/2 inch every 10 feet toward the downspout. Rotted fascia has to be replaced first.",
      },
      {
        cause: "Undersized gutters or a roof valley",
        howToTell:
          "The gutters are clean and pitched right but still overflow in heavy rain, usually at a corner where a roof valley dumps water. Water shoots over the gutter instead of into it.",
        fix: "Add a valley splash guard at the corner, add a downspout, or upsize from 5-inch to 6-inch gutters and from 2x3-inch to 3x4-inch downspouts.",
      },
      {
        cause: "Ice in the gutters",
        howToTell:
          "In freezing weather, gutters and downspouts are packed with ice and icicles hang from the edge. Meltwater runs over the front or backs up under the shingles.",
        fix: "Don't chip the ice out. Keep downspouts clear and pull snow off the roof edge with a roof rake from the ground. Heat cables are a stopgap. Repeated ice usually traces back to attic heat, which insulation and air sealing fix.",
      },
    ],
    tryFirst: [
      "During a heavy rain, watch from the ground or a window and note where water spills: along a whole run, at one low spot, at a corner, or near the downspout.",
      "Check the bottom of each downspout. If little water comes out while the gutter overflows, the downspout is clogged.",
      "On a single-story house, on a dry, calm day, set a sturdy extension ladder on firm, level ground, about 1 foot out from the wall for every 4 feet of height. Use a standoff so it doesn't rest on the gutter, and keep three points of contact.",
      "Wearing gloves, scoop debris into a bucket, then run a hose from the far end and watch whether the water flows to the downspout or pools.",
      "Flush a clogged downspout from the top with the hose, or feed a plumber's snake up from the bottom.",
      "Add downspout extensions or splash blocks so the water lands 4 to 6 feet from the foundation.",
    ],
    callAPro: [
      "The gutters are on a second story, over a steep slope, or near power lines.",
      "Gutters sag, pull away from the house, or hold standing water after cleaning.",
      "The fascia board behind the gutter is soft, rotted or stained.",
      "Clean gutters still overflow in heavy rain, or a downspout drains into a buried pipe that's clogged.",
      "Water is getting into the basement or pooling against the foundation.",
    ],
    costs: [
      { job: "Clean gutters and downspouts, one story", diy: "$0–$40", pro: "$100–$250" },
      { job: "Clean gutters and downspouts, two stories", diy: "Not recommended", pro: "$150–$450" },
      { job: "Add a downspout extension or splash block", diy: "$10–$40", pro: "$50–$150" },
      { job: "Re-hang and re-pitch a sagging run", diy: "$20–$60", pro: "$200–$600" },
      { job: "Replace a gutter section", diy: "$40–$150", pro: "$300–$1,000" },
      { job: "Gutter guards (whole house)", diy: "$150–$800", pro: "$1,000–$4,000" },
    ],
    tellThePro:
      "My gutters overflow [along the whole run / at one low spot / at a corner below a roof valley / near the downspout] in [every rain / only heavy rain]. The house is [one / two] stories with about [length] feet of [5-inch / 6-inch / not sure] gutters. I've [cleaned them / checked the downspouts] and water [still stands in the gutter / drains but still spills over]. The fascia [looks fine / is stained or soft]. Does your price include flushing the downspouts and hauling away the debris? If you recommend guards or new gutters, what warranty comes with them?",
    faqs: [
      {
        q: "Why are my gutters overflowing?",
        a: "Usually because the gutter or downspout is clogged with leaves, needles or shingle grit. If they're clean, the gutter may be sagging or sloped the wrong way, or too small for the roof area draining into it, which is common below a roof valley. In winter, ice can block gutters and downspouts.",
      },
      {
        q: "Why do my gutters overflow even when they're clean?",
        a: "Clean gutters that still overflow are usually pitched wrong, undersized, or overwhelmed at a corner where a roof valley concentrates the water. A valley splash guard, an extra downspout, or upgrading to 6-inch gutters with 3x4-inch downspouts usually solves it. A gutter contractor can size them to your roof.",
      },
      {
        q: "How much does it cost to have gutters cleaned?",
        a: "Typically $100 to $250 for a one-story house and $150 to $450 for two stories, depending on how many feet of gutter you have, how clogged they are, and whether the downspouts are flushed. Most homes need it once or twice a year, more under trees.",
      },
      {
        q: "Can overflowing gutters damage my foundation?",
        a: "Yes, over time. Water spilling over the gutter lands right against the house and saturates the soil at the foundation, which can lead to a wet basement and add pressure on the walls. It also rots the fascia and erodes landscaping. Fixing the gutters and moving downspout water 4 to 6 feet away costs far less than basement or foundation repairs.",
      },
    ],
  },
  {
    slug: "missing-shingles",
    title: "Missing shingles after wind: what to do and whether to repair or replace",
    metaTitle: "Missing Shingles After Wind? What to Do, Insurance and Costs",
    metaDescription:
      "Shingles blown off or lifted after wind? Why a few missing ones is urgent, what to do from the ground, insurance timing, repair vs replace, and roofer costs.",
    symptom: "Missing shingles",
    category: "roof_gutters",
    reviewed: "2026-09-28",
    quickAnswer:
      "A few missing shingles after a windstorm is urgent but rarely an emergency: the next rain can run under the neighboring shingles to the roof deck, and wind peels more off the exposed edges. Stay off the roof. Photograph the damage from the ground, check the attic for drips, and have a roofer tarp or repair it before the next rain. Replacing a few shingles typically costs $250 to $750. On a roof around 20 years old or older, or with widespread damage, replacing it often makes more sense. Sudden wind and hail damage is usually covered by homeowners insurance, so call your insurer promptly.",
    severity: "urgent",
    severityNote:
      "A few missing shingles won't flood the house today, but each rain soaks the underlayment and roof deck, and wind catches the exposed edges and strips more. Get it covered before the next storm, sooner if water is already coming in.",
    verdict: "call_pro",
    verdictNote:
      "Spotting damage from the ground, taking photos and filing the claim are yours to do. Tarping, shingle repairs and roof replacement are roofer jobs.",
    safety: [
      "A tree or large limb is on the roof, or a power line is down on or near the house: keep everyone away and out of the rooms below, and call 911 or the utility.",
      "Water is coming through a ceiling or near a light fixture: switch that circuit off at the breaker, catch the water, and call a roofer for a tarp.",
      "Don't go on the roof to inspect or tarp it yourself: storm-wet shingles are slick, and damaged ones can slide out from under you. Look from the ground with binoculars and let a roofer go up.",
    ],
    causes: [
      {
        cause: "Wind damage",
        howToTell:
          "After a windstorm, shingle pieces in the yard, and bare patches, exposed nail heads or dark underlayment on the roof, usually along the edges, corners and ridge where wind hits hardest.",
        fix: "A roofer replaces the missing shingles and seals down the ones around them. A few on an otherwise sound roof is a repair.",
      },
      {
        cause: "Lifted tabs or failed seal strips",
        howToTell:
          "Shingles that flap in the wind or stick up at the bottom edge, or a straight crease line across a tab where it folded back. Common when shingles were installed in cold weather and never sealed.",
        fix: "A roofer hand-seals lifted tabs with roofing cement. Creased shingles have lost their strength and should be replaced.",
      },
      {
        cause: "Old, brittle shingles",
        howToTell:
          "An asphalt roof around 20 years old or older. Shingles are curled, cracked or bald, gutters are full of granules, and pieces break off rather than blowing off whole.",
        fix: "Patching gets hard because old shingles crack when a roofer lifts them to slip in new ones. It's often time to replace the roof.",
      },
      {
        cause: "Poor nailing",
        howToTell:
          "Whole shingles blow off a fairly new roof, often from the same area. A fallen shingle has fewer than four nail holes, or holes above the nailing strip.",
        fix: "A roofer re-nails or replaces the affected area. On a newer roof, call the installer first: it may be covered by their workmanship warranty.",
      },
      {
        cause: "Hail damage",
        howToTell:
          "After a hailstorm, dents in gutters, downspouts and roof vents, and dark bruises on shingles where granules were knocked off. Shingles may be cracked or punctured rather than missing.",
        fix: "Hail damage is hard to see from the ground, so have a roofer or your insurer's adjuster inspect it. Widespread hail damage often means a new roof, which insurance often covers minus your deductible.",
      },
    ],
    tryFirst: [
      "Stay off the roof. Walk around the house and look from the ground with binoculars or your phone's zoom, especially at the edges, corners and ridge.",
      "Take dated photos and video of every side of the roof, the shingle pieces in the yard, and any damage inside. Keep a couple of fallen shingles: they help match the color and show how they were nailed.",
      "Check the attic with a flashlight for daylight, wet spots or drips under the damaged area, stepping only on the joists.",
      "Call a local roofer to tarp it before the next rain, and keep the receipt. Be wary of door-to-door crews after a storm.",
      "Call your insurance company or agent soon after the storm. Many policies require prompt notice and set deadlines for wind and hail claims, so check yours.",
    ],
    callAPro: [
      "Any shingles are missing, even a few. Get them covered or replaced before the next rain.",
      "You see creased, lifted or flapping shingles, or exposed underlayment or wood.",
      "There are water stains, drips or daylight in the attic.",
      "Hail hit your area, or you see new dents in gutters, vents or a car.",
      "The roof is around 20 years old or older and shingles keep cracking or blowing off.",
    ],
    costs: [
      { job: "Emergency roof tarp", diy: "Not recommended", pro: "$200–$1,000" },
      { job: "Roof inspection after a storm", diy: "—", pro: "$0–$400" },
      { job: "Hand-seal lifted shingle tabs", diy: "Not recommended", pro: "$150–$450" },
      { job: "Replace a few missing shingles", diy: "Not recommended", pro: "$250–$750" },
      { job: "Repair a larger section, including underlayment and decking", diy: "Not recommended", pro: "$800–$3,000" },
      { job: "Replace an asphalt shingle roof (typical house)", diy: "Not recommended", pro: "$8,000–$25,000" },
    ],
    tellThePro:
      "After [a windstorm / a hailstorm] on [date], I have [a few / a lot of] [missing / lifted / creased] shingles on the [front / back / side] of my roof, mostly near [the edges / the ridge / a corner]. The roof is [asphalt / architectural] shingle, about [age] years old, on a [one / two]-story house. I [have / haven't] seen water or stains inside, and I have photos. Can you tarp it before the next rain, and will you document the damage in writing for my insurance claim? If you recommend replacing the roof instead of repairing it, why?",
    faqs: [
      {
        q: "Is a few missing shingles an emergency?",
        a: "It's urgent, but not an emergency unless water is already coming in. With shingles gone, rain reaches the underlayment and can run under the shingles around the gap to the roof deck, and wind catches the exposed edges and strips more. Have it tarped or repaired before the next rain.",
      },
      {
        q: "Will homeowners insurance pay for missing shingles?",
        a: "Usually, if a storm blew them off. Most homeowners policies cover sudden wind and hail damage minus your deductible, which may be a separate, higher wind or hail deductible, but not wear or age. Report it promptly, take photos, keep your tarp receipt, and let the adjuster see the damage before the permanent repair.",
      },
      {
        q: "Should I repair or replace my roof after shingles blow off?",
        a: "Repair if the roof is well under 20 years old, the damage is limited to one area, and the shingles are still flexible. Replace if it's around 20 years old or older, the shingles crack when lifted, or damage is spread across several slopes. On an older roof, new shingles also rarely match the old ones.",
      },
      {
        q: "How much does it cost to replace missing shingles?",
        a: "Usually $250 to $750 for a few shingles, because most roofers have a minimum charge for going up. A larger section with new underlayment or decking can run $800 to $3,000. Replacing a whole asphalt shingle roof on a typical house costs roughly $8,000 to $25,000.",
      },
    ],
  },
  {
    slug: "foundation-cracks",
    title: "Foundation cracks: how to tell a normal crack from a structural problem",
    metaTitle: "Foundation Cracks? Which Are Serious and What Repairs Cost",
    metaDescription:
      "Most hairline foundation cracks are harmless shrinkage. How to spot horizontal, stair-step and widening cracks that need an engineer, and what repairs cost.",
    symptom: "Foundation cracks",
    category: "outdoor",
    reviewed: "2026-09-28",
    quickAnswer:
      "Most foundation cracks are thin, vertical hairline cracks in poured concrete, left by the concrete shrinking as it cured. They're usually cosmetic and only need sealing if they leak, typically $300 to $1,000 for a pro to inject one crack. Horizontal cracks, bowing walls, stair-step cracks that keep widening, and cracks wider than about 1/4 inch or offset point to soil pressure or settlement. Get a structural engineer's evaluation before you call a repair company. Mark the crack's ends in pencil with the date to see if it grows.",
    severity: "fix_soon",
    severityNote:
      "A hairline vertical crack usually just needs watching, or sealing if it leaks. It's urgent if a crack is horizontal, wider than about 1/4 inch, offset or growing, or the wall bows. Water against the foundation and freeze-thaw cycles make cracks worse.",
    verdict: "diy_if_handy",
    verdictNote:
      "Measuring and monitoring cracks, fixing gutters and grading, and sealing a hairline crack with a DIY injection kit are homeowner jobs. Diagnosing anything wider, horizontal or bowing is for a structural engineer, and the repair is for a foundation contractor.",
    safety: [
      "A horizontal crack, or a basement wall that bows, leans or bulges inward: have a structural engineer look at it soon, before you hire a repair contractor.",
      "New cracks come with doors or windows that suddenly stick, gaps around frames, or sloping floors: call a structural engineer. Engineers diagnose the problem and don't sell repairs.",
      "A crack is widening quickly, or you hear cracking or see the wall moving: keep people away from that wall and call a structural engineer or foundation contractor right away.",
    ],
    causes: [
      {
        cause: "Shrinkage (poured concrete)",
        howToTell:
          "Thin vertical or slightly diagonal hairline cracks, narrower than about 1/8 inch, often near the middle of a wall or at the corner of a basement window. Both sides are flush, and they usually appear in the first year or two.",
        fix: "Usually cosmetic. Mark it and watch it. If it leaks, seal it with a polyurethane or epoxy injection.",
      },
      {
        cause: "Water leaking through a crack",
        howToTell:
          "Damp streaks, drips, or white chalky deposits (efflorescence) along the crack after rain or snowmelt.",
        fix: "Fix the water first: clean the gutters, extend downspouts 4 to 6 feet out, and slope the soil away from the house. Then seal the crack with a flexible polyurethane injection. A leaking block wall may need exterior waterproofing or an interior drain.",
      },
      {
        cause: "Settlement (diagonal or stair-step cracks)",
        howToTell:
          "A crack that zigzags up the mortar joints of a block wall, or a diagonal crack in poured concrete that's wider at one end, often near a corner or where a downspout dumps water.",
        fix: "A small, stable crack can be repointed or sealed. If it's widening or wider than about 1/4 inch, an engineer should check for ongoing settlement, which may need piers.",
      },
      {
        cause: "Soil pressure (horizontal cracks)",
        howToTell:
          "A crack running sideways along a basement wall, often partway down, or along a mortar joint in block. Sometimes the wall above or below it leans inward.",
        fix: "A red flag. Wet or frozen soil is pushing the wall in. Get a structural engineer's evaluation, then a repair such as wall anchors, carbon fiber straps or steel braces.",
      },
      {
        cause: "Active movement (wide or offset cracks)",
        howToTell:
          "Wider than about 1/4 inch, or one side of the crack sits farther in or out, or higher or lower, than the other. You can feel a step when you run your hand across it.",
        fix: "Something has moved. An engineer should find out why before anyone patches it.",
      },
      {
        cause: "Bowing or leaning wall",
        howToTell:
          "A long level or a string pulled tight along the wall shows it bulging inward, usually with horizontal or stair-step cracks at the worst spot.",
        fix: "Needs an engineer. Moderate bowing can often be stabilized with wall anchors, carbon fiber straps or steel braces. Severe bowing may mean excavating and rebuilding the wall.",
      },
    ],
    tryFirst: [
      "Measure the crack at its widest point with an inexpensive crack gauge or crack-width card.",
      "Mark each end with a pencil line and the date, and draw a short line across the crack so you can see if the sides shift.",
      "Photograph it with a ruler or tape measure held against it, from the same spot each time. Repeat monthly and after heavy rain or a freeze-thaw season.",
      "Note the direction (vertical, stair-step or horizontal) and hold a 4-foot level or a tight string against the wall to check for bowing.",
      "Walk the house: check that doors and windows open normally, and look for new drywall cracks or sloping floors.",
      "Outside, clean the gutters, extend downspouts so water lands 4 to 6 feet out, and make sure the soil slopes away from the foundation.",
    ],
    callAPro: [
      "A crack is horizontal, or a wall bows, leans or bulges.",
      "It's wider than about 1/4 inch, or one side is offset from the other.",
      "It grows over a few months of monitoring.",
      "Doors or windows start sticking, floors slope, or new drywall cracks appear at the same time.",
      "Water keeps coming through after you've fixed the gutters and grading.",
    ],
    costs: [
      { job: "Epoxy or polyurethane crack injection (one crack)", diy: "$50–$150", pro: "$300–$1,000" },
      { job: "Structural engineer evaluation", diy: "—", pro: "$300–$1,000" },
      { job: "Extend downspouts and regrade soil at the foundation", diy: "$50–$300", pro: "$500–$3,000" },
      { job: "Wall anchors or carbon fiber straps (one wall)", diy: "Not recommended", pro: "$3,000–$12,000" },
      { job: "Foundation piers (per pier; most jobs need several)", diy: "Not recommended", pro: "$1,000–$3,000" },
    ],
    tellThePro:
      "I have a crack in my [poured concrete / concrete block] foundation wall, about [length] long and [width] wide, running [vertically / in a stair-step / horizontally]. One side [is / isn't] offset from the other, and the wall [is flat / bows inward about (amount)]. Since I marked it on [date], it has [stayed the same / grown]. It [does / doesn't] leak after rain, and doors and windows [work normally / have started sticking]. The house was built around [year]. Will I get a written report with the cause and a recommended repair, and are you independent of any repair company?",
    faqs: [
      {
        q: "Are cracks in a foundation normal?",
        a: "Hairline vertical cracks in poured concrete are very common and usually come from the concrete shrinking as it cured. They're mostly cosmetic, though they can let water in. Horizontal cracks, stair-step cracks that keep widening, and cracks wider than about 1/4 inch or offset aren't normal and need a structural engineer's evaluation.",
      },
      {
        q: "When should I worry about a foundation crack?",
        a: "When it's horizontal, wider than about 1/4 inch, offset so one side sticks out, or growing, or when a wall bows or doors and windows suddenly start sticking. Any of those can mean the foundation is moving. Have a structural engineer look before you get repair quotes.",
      },
      {
        q: "How much does it cost to fix a foundation crack?",
        a: "Sealing one non-structural crack with epoxy or polyurethane injection typically costs $300 to $1,000 from a pro, or $50 to $150 for a DIY kit. Stabilizing a bowing wall with anchors or carbon fiber straps usually runs $3,000 to $12,000, and piers for settlement often cost $1,000 to $3,000 each, with several needed. An engineer's evaluation, typically $300 to $1,000, tells you which one you actually need.",
      },
      {
        q: "Should I call a structural engineer or a foundation repair company?",
        a: "Start with a structural engineer for anything beyond a hairline crack. An engineer finds the cause and recommends a fix but doesn't sell repairs, so there's no reason to oversell. Take the report to two or three foundation contractors for quotes.",
      },
    ],
  },
  {
    slug: "garage-door-wont-close",
    title: "Garage door won't close: sensors, springs and what's safe to fix",
    metaTitle: "Garage Door Won't Close or Keeps Reversing? Fixes and Costs",
    metaDescription:
      "Garage door reverses or won't close? Check the safety sensors, the path, the lock button and limits, spot a broken spring or cable, and see what a pro charges.",
    symptom: "Garage door won't close",
    category: "doors_windows",
    reviewed: "2026-09-28",
    quickAnswer:
      "A garage door that starts down and then reverses, or won't close at all, most often has a safety sensor problem: the two small photo eyes near the floor on each side of the door are dirty, blocked or out of line. Clean the lenses, clear the path and adjust them until both lights glow steadily. Also check for a lock button on the wall control and a dead remote battery. A loud bang, a gap in the spring above the door or a loose cable means a broken spring or cable. Don't touch those: a technician typically charges $150 to $600 to replace the springs.",
    severity: "urgent",
    severityNote:
      "A door stuck open leaves the garage, and often the house, unsecured, so deal with it within a day. Most causes are a quick sensor fix. It becomes 'stop and call a pro now' if a spring or cable is broken, or the door is off its track or hanging crooked.",
    verdict: "diy_if_handy",
    verdictNote:
      "Cleaning and aligning the sensors, clearing the path, and checking the lock and remote battery are simple DIY. Adjusting the close limit is a handy job with the opener manual. Springs, cables, tracks and bottom rollers are for a garage door technician.",
    safety: [
      "A loud bang, a visible gap in the spring above the door, or a loose or snapped cable: don't run the opener or lift the door. Springs and cables store enough energy to cause serious injury. Never adjust, loosen or replace them yourself: call a garage door technician.",
      "A spring or cable is broken and the door is open: don't pull the emergency release. Without the spring holding it, the door can drop hard. Keep people, pets and cars out from under it.",
      "The door is off its track, hanging crooked or jammed partway: leave it alone and keep everyone clear. It can fall. Call a technician.",
      "The door doesn't reverse when it hits a 2x4 on the floor or when you block the sensor beam: stop using the opener until it's fixed. It can seriously injure a child or pet.",
    ],
    causes: [
      {
        cause: "Dirty, blocked or misaligned safety sensors",
        howToTell:
          "The door goes down a little, then reverses, and the opener's light may blink. One of the small lights on the sensors near the floor is off or flickering, a sensor has been bumped out of line, or low sun shines straight into one.",
        fix: "Wipe the lenses, clear anything in the beam, and adjust the brackets until both sensor lights glow steadily. Check the thin sensor wires for cuts, loose staples or chew marks.",
      },
      {
        cause: "Something in the door's path",
        howToTell:
          "The door stops and reverses at the same spot every time. A bin, a tool, snow or debris is under the door, or something is caught in one of the tracks.",
        fix: "Clear the floor under the door and look along both tracks for anything stuck in them.",
      },
      {
        cause: "Close limit or force set wrong",
        howToTell:
          "The door reaches the floor, then goes right back up, and the sensor lights stay steady. It often starts after a new opener or bottom seal, or in cold weather when the door moves more stiffly.",
        fix: "Adjust the close limit on the motor unit (a screw, dial or buttons, depending on the model) so the door just seals against the floor. Follow the opener manual. Don't just turn up the close force: that weakens the safety reversal. Repeat the 2x4 test after any change.",
      },
      {
        cause: "Lock button on or remote battery dead",
        howToTell:
          "The wall button works but the remote or keypad doesn't, and a lock light may be on at the wall control. If nothing works at all, the opener may have lost power.",
        fix: "Turn the lock feature off (on many wall controls you hold the lock button for a few seconds) and replace the remote's battery. If nothing works, check that the opener is plugged in and the breaker or garage GFCI outlet hasn't tripped.",
      },
      {
        cause: "Broken torsion or extension spring",
        howToTell:
          "A loud bang like a gunshot, then the door is very heavy and the opener strains or stops after a few inches. A torsion spring on the bar above the door has a gap in its coils. An extension spring along either overhead track hangs loose or looks stretched.",
        fix: "A garage door technician replaces the springs, usually both at once. Don't run the opener or lift the door in the meantime.",
      },
      {
        cause: "Snapped or loose cable, or rollers off the track",
        howToTell:
          "The door hangs crooked with one side lower than the other, a cable is slack or dangling near a bottom corner, rollers have come out of the track, or the track is bent. Often after a car bumps the door or a spring breaks.",
        fix: "A technician resets the door, replaces the cable and straightens or replaces the track. Leave the door where it is until then.",
      },
    ],
    tryFirst: [
      "Look for danger signs first: a gap in the spring above the door, a loose cable or a crooked door. If you see any of them, stop here and call a technician.",
      "Clear the floor under the door and check both tracks for anything in the way.",
      "Wipe the lenses of both safety sensors with a soft cloth, and adjust the brackets until both small lights glow steadily.",
      "Check the wall control for a lock light and turn the lock off, then replace the remote battery.",
      "To close it now, press and hold the wall button until the door is fully down: many openers override the sensors this way. Watch it the whole time and keep people, pets and cars clear. If that fails and the springs and cables look intact, close it by hand with the red emergency release cord.",
      "Once it closes normally, lay a 2x4 flat on the floor where the door lands and close the door. It should reverse as soon as it touches the board. Repeat this test every month.",
    ],
    callAPro: [
      "Any sign of a broken spring or a loose or snapped cable.",
      "The door is crooked, off its track, or the track is bent.",
      "The door still reverses with the sensors aligned and the path clear, or it fails the 2x4 test.",
      "The opener hums, grinds or runs without moving the door.",
    ],
    costs: [
      { job: "Garage door service call", diy: "—", pro: "$75–$200" },
      { job: "Replace a pair of safety sensors", diy: "$30–$90", pro: "$100–$250" },
      { job: "Replace springs (pair, torsion or extension)", diy: "Not recommended", pro: "$150–$600" },
      { job: "Replace lift cables", diy: "Not recommended", pro: "$150–$350" },
      { job: "Put the door back on track or replace rollers", diy: "Not recommended", pro: "$150–$450" },
      { job: "Replace the opener", diy: "$180–$500", pro: "$400–$1,000" },
    ],
    tellThePro:
      "My [single / double] garage door [starts down, then reverses / won't move at all / hangs crooked]. The opener light [blinks / doesn't blink], and the sensor lights are [both steady / one off or flickering]. I [heard a loud bang / didn't hear anything unusual], the spring above the door [has a gap / looks intact], and the cables [look fine / are loose or hanging]. The door is about [age] years old. If it's the springs, will you replace both, and does your price include new cables, a roller check and a safety test of the opener?",
    faqs: [
      {
        q: "Why does my garage door go back up when I try to close it?",
        a: "Usually the safety sensors. If they're dirty, bumped out of line, blocked or hit by direct sun, the opener thinks something is in the way and reverses. Clean the lenses and adjust them until both lights glow steadily. If the sensors are fine and the door reverses right after touching the floor, the close limit likely needs adjusting.",
      },
      {
        q: "How do I close my garage door manually?",
        a: "Only if the springs and cables are intact: no gap in the spring above the door, no loose cable, and the door hangs level. Pull the red emergency release cord, then lower the door slowly by its handle, keeping fingers out of the joints between panels. Many openers reconnect on the next run, and if you slide the side lock closed, unlock it before using the opener again.",
      },
      {
        q: "How much does it cost to fix a broken garage door spring?",
        a: "Typically $150 to $600, depending on whether it's a torsion or extension system and whether both springs are replaced, which most technicians recommend. It isn't a DIY job: the springs store enough energy to cause serious injury. Don't open the door or run the opener until it's fixed.",
      },
      {
        q: "How do I test my garage door's auto-reverse?",
        a: "Lay a 2x4 flat on the floor in the middle of the door's path and close the door. It should reverse as soon as it touches the board. Then close it again and pass something like a broom handle through the sensor beam: it should reverse. If it fails either test, stop using the opener until it's fixed, and repeat the test every month.",
      },
    ],
  },
  {
    slug: "condensation-between-window-panes",
    title: "Condensation between window panes: why it happens and what fixes it",
    metaTitle: "Condensation Between Window Panes? Fixes, Warranty and Costs",
    metaDescription:
      "Fog between double-pane glass means a failed seal. How to tell it from normal condensation, whether the warranty covers it, and what new glass or windows cost.",
    symptom: "Condensation between window panes",
    category: "doors_windows",
    reviewed: "2026-09-28",
    quickAnswer:
      "Fog or moisture between the two panes of a double-pane window means the edge seal of the insulated glass unit (IGU) has failed and humid air has gotten into the gap. It can't be wiped off or fixed from either side. It's mostly cosmetic: the window loses a little insulating value. Check the manufacturer's warranty first, since many cover seal failure for 10 to 20 years, or for life for the original owner. Otherwise, replacing just the glass unit typically costs $150 to $700 per window, well below the price of a new window.",
    severity: "cosmetic",
    severityNote:
      "Fog between the panes doesn't harm the house. The glass insulates a bit less, and the fog usually gets worse and can leave a permanent white haze. Moisture on the room side of the glass is different: if it runs down and soaks the sill, it can rot wood and grow mold.",
    verdict: "call_pro",
    verdictNote:
      "Figuring out which surface the moisture is on, lowering indoor humidity and clearing weep holes are DIY. A failed seal can't be fixed from either side: replacing the glass unit or the window is a job for a glass or window company.",
    causes: [
      {
        cause: "Failed seal in the glass unit",
        howToTell:
          "Fog, droplets or a milky haze between the two panes that won't wipe off from either side. It comes and goes with sun and temperature, and older failures leave streaks or white spots.",
        fix: "The seal can't be repaired. Live with it, or replace the glass unit or the whole window. Check the warranty first.",
      },
      {
        cause: "High indoor humidity (room-side condensation)",
        howToTell:
          "Water or frost on the room side of the glass, usually in cold weather and worst in the morning, in bedrooms, bathrooms and kitchens. It wipes off with a finger.",
        fix: "Lower the humidity: run bath and kitchen fans, use a dehumidifier, open blinds and curtains so warm air reaches the glass, and turn down any humidifier. Aim for about 30 to 50 percent, lower in very cold weather.",
      },
      {
        cause: "Normal outside condensation",
        howToTell:
          "Dew on the outside of the glass on cool, clear, humid mornings that burns off once the sun hits it. Most common on newer energy-efficient windows.",
        fix: "Nothing to fix. The glass insulates well, so the outer pane stays cold and collects dew like a car windshield.",
      },
      {
        cause: "Moisture between the window and a storm window",
        howToTell:
          "You have a separate storm window or insert, and the moisture is in the gap between it and the main window. You can open or remove one of them to reach it.",
        fix: "This isn't a sealed unit, so it can be wiped and dried. Warm, moist indoor air is leaking into the gap: weatherstrip the inner window, and keep the weep holes at the bottom of an exterior storm window open.",
      },
      {
        cause: "Water sitting against the edge of the glass",
        howToTell:
          "The fog shows up first along the bottom of the glass. Rain collects in the bottom of the sash or track, and the small weep holes on the outside of the frame are clogged.",
        fix: "Clear the weep holes and keep the track clean. Standing water speeds up seal failure, so fix it before or when you replace the glass.",
      },
    ],
    tryFirst: [
      "Wipe the room side of the glass with a dry cloth. If the moisture comes off, it's indoor humidity, not the seal.",
      "Wipe the outside of the glass. If it comes off there, it's normal dew.",
      "If it won't wipe off from either side, the seal has failed. Look for a name or date printed on the metal spacer between the panes or on a label on the frame, and check the manufacturer's warranty before paying for anything.",
      "For room-side moisture, get a hygrometer and keep indoor humidity around 30 to 50 percent: run bath and kitchen fans, use a dehumidifier and open the blinds.",
      "Clear the weep holes on the outside bottom of the frame with a thin wire so rain doesn't sit against the glass.",
      "Count the foggy windows and note rough sizes. Glass is priced per window, and a list speeds up quotes.",
    ],
    callAPro: [
      "The fog bothers you and you want a clear view: a glass or window company can replace just the glass unit.",
      "The window may be under warranty: contact the manufacturer or installer before paying anyone else, since outside repairs like defogging can void it.",
      "Several windows have failed, or the frames are rotting, drafty or hard to open: get quotes on replacement windows.",
      "Room-side condensation keeps soaking sills or growing mold after you've lowered the humidity: have an HVAC contractor or energy auditor check the ventilation.",
    ],
    costs: [
      { job: "Hygrometer (humidity monitor)", diy: "$10–$25", pro: "—" },
      { job: "Portable dehumidifier", diy: "$150–$350", pro: "—" },
      { job: "Defogging service (per window)", diy: "—", pro: "$75–$200" },
      { job: "Replace the glass unit only (per window)", diy: "Not recommended", pro: "$150–$700" },
      { job: "Glass unit replaced under warranty (labor may be extra)", diy: "—", pro: "$0–$250" },
      { job: "Replace the whole window (per window, installed)", diy: "Not recommended", pro: "$500–$2,000+" },
    ],
    tellThePro:
      "I have [number] [double-hung / casement / sliding / picture] windows with fog between the panes, roughly [width] by [height] inches. They're about [age] years old, made by [manufacturer / unknown], with [vinyl / wood / aluminum / fiberglass] frames in [good / poor] shape. I'd like a quote to replace [just the glass units / the whole windows]. Will the new glass match the original, including the low-E coating and gas fill, and what warranty comes with it?",
    faqs: [
      {
        q: "Why is there condensation between my window panes?",
        a: "The seal around the edge of the double-pane glass has failed. The gap is meant to hold dry air or argon gas, and once the seal breaks, humid air leaks in and condenses on the inner surfaces of the glass as temperatures change. You can't wipe it off or reseal it from either side. It's mostly cosmetic, with a small loss of insulating value.",
      },
      {
        q: "Can you fix a foggy double-pane window without replacing it?",
        a: "Not reliably. Defogging services drill small holes, clean and dry the gap, then plug the holes or fit vents, and the view often improves, but the seal and any argon gas aren't restored and stains or etching can stay. Results are mixed, and it may void a remaining warranty. Replacing just the glass unit is the dependable fix, and the frame can stay.",
      },
      {
        q: "How much does it cost to replace a foggy window pane?",
        a: "Replacing just the sealed glass unit typically costs $150 to $700 per window, depending on size and glass type. A whole new window typically runs $500 to $2,000 or more installed. Check the warranty first: many manufacturers cover seal failure for 10 to 20 years, or for life for the original owner, though labor may not be included.",
      },
      {
        q: "Why do my windows have condensation on the inside or outside?",
        a: "Moisture on the room side of the glass means indoor humidity is high for how cold it is outside: run fans, use a dehumidifier and open the blinds. Dew on the outside on cool, humid mornings is normal, especially on energy-efficient windows, and burns off as the sun warms the glass. Only moisture you can't wipe off from either side means a failed seal.",
      },
    ],
  },
  {
    slug: "door-sticking",
    title: "Door sticking or not latching: how to fix it and when it's a warning sign",
    metaTitle: "Door Sticking or Won't Latch? Simple Fixes and When to Worry",
    metaDescription:
      "Door sticking or not latching? Tighten hinges, try the 3-inch screw trick, adjust the strike or plane the edge. Foundation warning signs and what a pro charges.",
    symptom: "Door sticking",
    category: "doors_windows",
    reviewed: "2026-09-28",
    quickAnswer:
      "Most sticking doors come from loose hinge screws that let the door sag, humidity that swells the wood in summer, paint built up on the edges, or a strike plate that no longer lines up with the latch. Start by tightening every hinge screw. If the door still rubs at the top on the latch side, drive a 3-inch screw through the top hinge into the stud behind the jamb. Plane the edge only as a last resort. If several doors stick at once, or you see new cracks above doors or sloping floors, have a structural engineer check for foundation movement, typically $300 to $800.",
    severity: "fix_soon",
    severityNote:
      "A rubbing interior door is an annoyance, but forcing it wears out the hinges, latch and frame. An exterior door that won't latch or lock is more pressing. It's a bigger concern if several doors stick at once along with new cracks or sloping floors.",
    verdict: "diy",
    verdictNote:
      "Tightening hinges, the 3-inch screw trick and adjusting the strike plate need only a drill and a screwdriver. Planing an edge is a handy job. Rehanging a door, repairing a rotted frame and any structural question are for a carpenter or structural engineer.",
    safety: [
      "Several doors and windows start sticking at once, with new cracks in the walls or foundation or floors that slope: have a structural engineer look before you plane or rehang anything.",
      "The frame is cracked, soft or rotted, or pulling away from the wall: stop forcing the door and call a carpenter. There may be water damage or a failing header above it.",
    ],
    causes: [
      {
        cause: "Loose hinge screws",
        howToTell:
          "The door rubs at the top corner on the latch side, and the gap at the top on the hinge side is wide. Screws in the top hinge are loose or spin in their holes.",
        fix: "Tighten every hinge screw. Fill stripped holes, or drive a 3-inch screw through the top hinge into the stud behind the jamb.",
      },
      {
        cause: "Humidity swelling",
        howToTell:
          "The door sticks in humid summer weather or after rain and works fine in winter. Wood doors with unpainted top or bottom edges are the worst.",
        fix: "Run the AC or a dehumidifier. If you plane it, wait for a dry spell, and seal every edge afterward, including the top and bottom.",
      },
      {
        cause: "Paint buildup",
        howToTell:
          "Thick, lumpy layers of paint on the door edge, the jamb or the doorstop. A freshly painted door may stick to the stop.",
        fix: "Scrape or sand the built-up paint off the edge and jamb, repaint with thin coats, and let the paint cure for a few days before closing the door tightly.",
      },
      {
        cause: "Strike plate out of line",
        howToTell:
          "The door closes but won't latch unless you push, pull or lift it. The strike plate is scratched above or below its opening.",
        fix: "File the strike opening a little larger, or move the plate so it lines up with the latch.",
      },
      {
        cause: "House settling",
        howToTell:
          "The gap around the door is uneven, for example wider at one end of the top than the other, and the door looks out of square in its frame. Common in newer houses and with seasonal soil movement.",
        fix: "Minor settling is normal. Use the 3-inch screw trick or shim a hinge to square the door, then plane any spot that still rubs.",
      },
      {
        cause: "Foundation or structural movement",
        howToTell:
          "Several doors and windows start sticking at once, with new diagonal cracks in the drywall above door corners, floors that slope, or cracks in the foundation or brick.",
        fix: "Have a structural engineer find the cause before you plane or rehang doors, or you'll keep chasing the movement.",
      },
    ],
    tryFirst: [
      "Close the door slowly and look at the gap around it. It should be even, about 1/8 inch. A tight spot or worn, shiny paint shows where it rubs. Tight at the top on the latch side means the door is sagging.",
      "Open the door and tighten every hinge screw on the door and the jamb. If a screw just spins, pack the hole with wooden toothpicks or a golf tee dipped in wood glue, snap them off flush and drive the screw back in.",
      "If it still rubs at the top on the latch side, replace one jamb-side screw in the top hinge with a 3-inch screw. Use the hole closest to the doorstop so it reaches the stud, and tighten gently: it pulls the top of the door back toward the hinge side.",
      "If the latch won't catch, color the latch with a marker or lipstick and close the door. The mark shows where it hits the strike plate. File the opening a little, or move the plate to line up.",
      "If it still rubs, mark the tight spot and sand or plane it a little at a time, taking the door off its hinges if needed. Seal the bare wood with primer and paint or finish, including the top and bottom edges.",
    ],
    callAPro: [
      "Several doors or windows start sticking at the same time.",
      "New cracks appear in the drywall above doors, floors slope, or the foundation has cracks.",
      "The frame is cracked, rotted or pulling away from the wall.",
      "An exterior door won't latch or lock after you've adjusted the hinges and strike.",
      "The door needs rehanging or replacing, or more than about 1/4 inch taken off.",
    ],
    costs: [
      { job: "Tighten hinges or add 3-inch screws", diy: "$5–$15", pro: "$100–$200" },
      { job: "Adjust or move the strike plate", diy: "$5–$20", pro: "$100–$200" },
      { job: "Plane and refinish a door edge", diy: "$20–$60", pro: "$150–$350" },
      { job: "Replace an interior prehung door", diy: "$80–$350", pro: "$300–$1,000" },
      { job: "Replace an exterior prehung door", diy: "Not recommended", pro: "$800–$3,500" },
      { job: "Structural engineer evaluation", diy: "—", pro: "$300–$800" },
    ],
    tellThePro:
      "My [interior / exterior] door [rubs at the top / rubs along the latch side / drags on the floor / won't latch]. The gap around it is [even / wider at the top on the hinge side / uneven]. It started [suddenly / gradually / in humid weather]. I've [tightened the hinge screws / added a 3-inch screw / adjusted the strike plate]. [Only this door / Several doors and windows] stick, and I [have / haven't] noticed new cracks above doors or sloping floors. Can you fix it by adjusting the hinges and strike, or does it need planing or rehanging, and does your price include sealing and painting the edge?",
    faqs: [
      {
        q: "Why is my door suddenly sticking?",
        a: "Usually humidity or a loose hinge. Wood swells in humid weather, and a loose top hinge screw lets the door sag into the frame. Tighten the hinge screws first. If several doors start sticking at once, with new cracks or sloping floors, have a structural engineer check the foundation.",
      },
      {
        q: "How do I fix a door that won't latch?",
        a: "The latch and the strike plate no longer line up. Color the latch with a marker or lipstick, close the door, and see where the mark lands on the strike plate. If it's off by about 1/8 inch or less, file the opening in the strike. If it's off by more, tighten the hinges first, then move the strike plate.",
      },
      {
        q: "Should I plane a door that sticks in summer?",
        a: "Try everything else first, and if you do plane it, wait for a drier stretch. A door planed while swollen can leave a large gap once it shrinks in winter. Take off only what's needed, then seal the bare edge with primer and paint or finish so it doesn't soak up moisture again.",
      },
      {
        q: "Can a sticking door mean foundation problems?",
        a: "It can, but usually it doesn't. One sticking door is almost always hinges, humidity or paint. Several doors and windows sticking at once, especially with new diagonal cracks above door corners, sloping floors or cracks in the foundation, point to foundation movement worth an engineer's look.",
      },
    ],
  },
  {
    slug: "rotting-deck-boards",
    title: "Rotting deck boards: how to check for rot and when a deck is unsafe",
    metaTitle: "Rotting Deck Boards? How to Check for Rot and Repair Costs",
    metaDescription:
      "Soft or rotting deck boards? The screwdriver test, how to check the joists, ledger and posts, when a deck is unsafe, and what repairs or a new deck cost.",
    symptom: "Rotting deck boards",
    category: "outdoor",
    reviewed: "2026-09-28",
    quickAnswer:
      "Soft, spongy or crumbling wood on a deck is rot, and where it is matters more than how much. Push a screwdriver into the wood: if it sinks in more than about 1/4 inch or the wood comes out soft and crumbly, it's rotting. A few rotted deck boards are a DIY swap for $50 to $250. Rot in the ledger (where the deck attaches to the house), the posts or the joists is structural: keep people off and call a deck builder. Ledger failure is a leading cause of deck collapses. Gray, weathered wood that's still hard is fine.",
    severity: "fix_soon",
    severityNote:
      "A few soft deck boards can wait a few weeks if you block them off, though rot spreads and a board can break underfoot. It becomes 'stop and call a pro now' if the ledger, posts, joists or railings are soft or loose, or the deck bounces, leans or pulls away from the house.",
    verdict: "diy_if_handy",
    verdictNote:
      "Probing for rot, cleaning and sealing, and replacing individual deck boards are handy-homeowner jobs. Joists, beams, posts, the ledger, stairs and railings hold people up: have a deck builder repair them, and expect a permit for structural work in many areas.",
    safety: [
      "The ledger, a post, a beam or a joist is soft or rotting, or the deck is pulling away from the house: keep everyone off the deck and call a deck builder or structural engineer.",
      "The deck bounces, sways or leans, or a post is cracked or tilted: keep people off it until it's inspected.",
      "A railing or stair handrail is loose: don't lean on it, keep kids away from that side, and block it off until it's fixed.",
    ],
    causes: [
      {
        cause: "Rotting deck boards",
        howToTell:
          "Soft or spongy spots underfoot, dark stains, deep cracks, or boards that flex or crumble at the ends and around screws. Worst in shade, under planters and where leaves pile up.",
        fix: "Replace the bad boards. If more than a handful are going, check the framing underneath before re-decking.",
      },
      {
        cause: "Rot in the joists or beams",
        howToTell:
          "From underneath: dark, soft wood on the tops of joists under board seams, at joist ends, or where a beam sits on a post. A screwdriver sinks in easily.",
        fix: "A small rotted section can often be reinforced by sistering a new joist alongside it. Widespread rot means rebuilding the frame. A deck builder should judge which.",
      },
      {
        cause: "Rotting or loose ledger board",
        howToTell:
          "The ledger is the board fastened to the house that the joists hang from. Soft wood, rust streaks or water stains on it or the house behind it, no metal flashing over the top, only nails instead of bolts, or a gap opening between the deck and the house.",
        fix: "A deck builder replaces the ledger with proper flashing and bolts or structural screws, and checks the house framing behind it. Ledger failure is a leading cause of deck collapses.",
      },
      {
        cause: "Rotting posts at ground level",
        howToTell:
          "Soft, cracked or crumbling wood where posts meet the ground or sit in soil or concrete. The post may lean, or the deck may sag above it.",
        fix: "Replace the post with ground-contact rated lumber on a concrete footing, with a metal post base that keeps the wood off the ground. The deck has to be temporarily supported while it's done.",
      },
      {
        cause: "Loose or corroded fasteners and joist hangers",
        howToTell:
          "Nails popping up, screws that spin, rust streaks, or metal joist hangers that are flaking, thinned by rust or missing nails. Common on older decks built with non-galvanized hardware.",
        fix: "Reset or replace popped fasteners. Replace corroded hangers and connectors with hot-dip galvanized or stainless steel ones rated for treated lumber, using the fasteners the hanger maker specifies.",
      },
      {
        cause: "Weathered but sound wood",
        howToTell:
          "Gray, faded wood with fine cracks along the grain, but it feels hard and a screwdriver barely goes in.",
        fix: "Nothing structural. Clean it, let it dry, and apply a penetrating stain or sealer to slow cracking and water absorption.",
      },
    ],
    tryFirst: [
      "Keep people off any area that feels soft, bouncy or loose, and block it off.",
      "Do the screwdriver test: push a flat screwdriver or awl into the wood with firm hand pressure. Sound wood resists and splinters in long pieces. If the tip sinks in more than about 1/4 inch or the wood comes out soft and crumbly, it's rotting.",
      "Probe the deck boards, then go underneath with a flashlight and probe the ledger, the joist ends near the house, the tops of the joists under board seams, the beam, and each post at ground level.",
      "Check the ledger: look for bolts or lag screws rather than only nails, metal flashing over the top, and any gap between the deck and the house.",
      "Shake the railings and stair handrails, and look for posts that lean and joist hangers that are rusted or missing nails.",
      "Photograph what you find with something for scale, and note which areas are soft. A builder can quote faster from it.",
    ],
    callAPro: [
      "Any soft or rotting wood in the ledger, posts, beams or joists.",
      "The deck bounces, sways, leans or has pulled away from the house.",
      "Railings or stairs are loose or wobbly.",
      "Joist hangers or other metal connectors are badly rusted.",
      "More than a handful of boards need replacing, or the deck is 20 or more years old.",
    ],
    costs: [
      { job: "Replace a few deck boards", diy: "$50–$250", pro: "$300–$900" },
      { job: "Sister a rotted joist", diy: "Not recommended", pro: "$250–$800 per joist" },
      { job: "Replace a rotted post (with new footing)", diy: "Not recommended", pro: "$300–$1,000 per post" },
      { job: "Replace the ledger board (with flashing)", diy: "Not recommended", pro: "$1,000–$5,000+" },
      { job: "Replace the deck, pressure-treated wood", diy: "—", pro: "$30–$70 per sq ft" },
      { job: "Replace the deck, composite", diy: "—", pro: "$50–$100 per sq ft" },
    ],
    tellThePro:
      "My [wood / composite] deck is about [age] years old and [height] off the ground. I found soft or rotting wood in [some deck boards / the joists / the ledger at the house / the posts at ground level], and the deck [feels solid / bounces / leans / has pulled away from the house]. The joist hangers are [fine / rusty], and the ledger is attached with [bolts / nails / I can't tell]. Is it worth repairing, or should it be replaced, and does your quote include the permit, haul-away of the old wood, and new flashing at the house?",
    faqs: [
      {
        q: "How do I know if my deck boards are rotting?",
        a: "Push a flat screwdriver into the wood with firm hand pressure. Sound wood resists and splinters in long pieces. If the tip sinks in more than about 1/4 inch or the wood comes out soft and crumbly, it's rotting. Gray color and fine surface cracks on hard wood are normal weathering.",
      },
      {
        q: "Is it safe to walk on a deck with rotting boards?",
        a: "It depends where the rot is. A few soft deck boards can be blocked off until you replace them. If the ledger, posts, joists or beams are soft, or the deck bounces, leans or is pulling away from the house, keep everyone off it until a deck builder or structural engineer inspects it.",
      },
      {
        q: "How much does it cost to replace rotted deck boards?",
        a: "Replacing a few boards yourself usually costs $50 to $250 in lumber and screws, and a pro typically charges $300 to $900 for a small repair. Replacing a whole deck runs roughly $30 to $70 per square foot for pressure-treated wood and $50 to $100 per square foot for composite.",
      },
      {
        q: "Can you replace deck boards without replacing the frame?",
        a: "Yes, if the joists, beams, posts and ledger are sound. Probe them before you re-deck, because new boards on a rotting frame won't last. Many builders add joist tape over the tops of the joists when re-decking to help keep water out of the wood.",
      },
    ],
  },
  {
    slug: "leaky-faucet",
    title: "Leaky faucet: find your faucet type and stop the drip",
    metaTitle: "Leaky Faucet? Fixes for Each Faucet Type and Repair Costs",
    metaDescription:
      "A dripping faucet needs a new washer, cartridge, ball kit or seals, depending on its type. How to tell which you have, fix it, and what a plumber charges.",
    symptom: "Leaky faucet",
    category: "plumbing",
    reviewed: "2026-09-28",
    quickAnswer:
      "Most drips come from a worn part inside the faucet, and the fix depends on the type. Two-handle faucets you crank down to close are compression faucets and need a new washer, sometimes a new seat. Single-handle faucets use a cartridge, a ball (common on older kitchen faucets) or a ceramic disc, and you replace that part or its seals. A leak at the base is usually worn O-rings. Parts run $5 to $60. A plumber typically charges $150 to $350 to repair a faucet, and $250 to $800 to install a new one.",
    severity: "fix_soon",
    severityNote:
      "Not dangerous, but a steady drip can waste thousands of gallons a year, and a hot drip wastes the energy to heat it too. Cranking the handles harder to stop it wears the washer and seat faster.",
    verdict: "diy_if_handy",
    verdictNote:
      "Replacing a washer, O-rings or a cartridge is a handy-homeowner job with a screwdriver, a hex key and an adjustable wrench. Call a plumber if the shutoff valves won't close or the parts are seized. Swapping the whole faucet is DIY if the connections underneath are in good shape.",
    safety: [
      "A shutoff valve under the sink breaks, sprays or won't stop leaking when you turn it: shut off the main water valve and call a plumber.",
      "Water is dripping onto an outlet or the garbage disposal wiring under the sink: switch off that breaker before you reach in.",
    ],
    causes: [
      {
        cause: "Worn washer or seat (compression faucet)",
        howToTell:
          "Two separate hot and cold handles that turn several times and have to be cranked down to stop the flow. The drip often comes from one side only: feel whether it's hot or cold.",
        fix: "Replace the rubber washer on the bottom of the stem, and the stem O-ring while it's apart. If the brass seat inside the faucet is pitted, replace it with a seat wrench or smooth it with a seat-grinding tool.",
      },
      {
        cause: "Worn cartridge",
        howToTell:
          "A single handle that lifts and swivels, or two handles that stop after a quarter or half turn. The spout drips, or the handle is getting stiff.",
        fix: "Replace the cartridge. Note the brand, take the old cartridge to the store to match it, and check the warranty first: some manufacturers replace cartridges free.",
      },
      {
        cause: "Worn O-rings",
        howToTell:
          "Water seeps out around the base of the spout when the water runs, most often on a kitchen faucet with a swivel spout. Or it seeps from under a handle.",
        fix: "Replace the O-rings on the faucet body or stem and coat the new ones with silicone plumber's grease.",
      },
      {
        cause: "Worn seats and springs (ball faucet)",
        howToTell:
          "A single handle on a rounded, dome-shaped cap that moves in every direction, usually on an older kitchen faucet. It drips from the spout or leaks under the handle.",
        fix: "Rebuild it with a ball faucet repair kit: new rubber seats, springs and O-rings, plus a new ball if the old one is scratched. Match the brand.",
      },
      {
        cause: "Dirty or worn seals (ceramic disc faucet)",
        howToTell:
          "A single lever over a wide, round cylinder under the handle. It drips even though the discs rarely wear out, sometimes right after the water was shut off and turned back on.",
        fix: "Pull the disc cartridge, clean grit off the discs and replace the rubber seals on its bottom. Replace the cartridge if a disc is cracked or scored.",
      },
      {
        cause: "Faucet at the end of its life",
        howToTell:
          "The body is corroded or cracked, it leaks in several places, parts are hard to find, or it still drips after new parts.",
        fix: "Replace the faucet. Replace the supply lines and, if they're stiff or crusty, the shutoff valves at the same time.",
      },
    ],
    tryFirst: [
      "Close both shutoff valves under the sink (turn them clockwise), then open the faucet to confirm the water is off and let the pressure out.",
      "Put the stopper in or cover the drain with a rag so no small parts go down it, and lay a towel in the sink.",
      "Identify the faucet type: two handles you crank down (compression), a round cap that moves every direction (ball), a single lever on a wide cylinder (ceramic disc), or anything else (usually a cartridge). Look for a brand name.",
      "Pry off the decorative cap, remove the handle screw, and lay the parts out in order. Take a photo at each step.",
      "Take the old washer, cartridge or kit parts to the store, with the brand name, to get an exact match.",
      "Reassemble, leave the faucet open, and turn the valves back on slowly so air and grit flush out.",
    ],
    callAPro: [
      "The shutoff valves under the sink won't close or leak when you turn them.",
      "The handle, stem or cartridge is seized and won't come out without force.",
      "It still drips after you've replaced the parts.",
      "Water is showing up inside the cabinet or the wall, not just at the faucet.",
    ],
    costs: [
      { job: "Replace washers and O-rings", diy: "$5–$15", pro: "$150–$300" },
      { job: "Replace a faucet cartridge", diy: "$15–$60", pro: "$150–$350" },
      { job: "Rebuild a ball faucet with a repair kit", diy: "$10–$30", pro: "$150–$300" },
      { job: "Replace a shutoff valve under the sink", diy: "$10–$30", pro: "$150–$350" },
      { job: "Replace a kitchen or bathroom faucet (mid-range)", diy: "$75–$350", pro: "$250–$800" },
    ],
    tellThePro:
      "My [kitchen / bathroom / tub] faucet [drips from the spout / leaks at the base / leaks under the handle]. It's a [single-handle / two-handle] faucet, [brand if known], about [age] years old. The shutoff valves under the sink [work / are stuck or leak]. I've [replaced the washer / replaced the cartridge / not tried anything yet]. Is it worth repairing, or should I replace it? If it's a replacement, does your price include the faucet, new supply lines and haul-away?",
    faqs: [
      {
        q: "Why is my faucet leaking at the base?",
        a: "Worn O-rings, most often. On a kitchen faucet with a swivel spout, the O-rings around the faucet body wear out and water seeps out under the spout when it runs. Shut off the water, remove the handle and spout, and replace the O-rings, coating the new ones with silicone plumber's grease.",
      },
      {
        q: "Why is my faucet still dripping after I replaced the washer?",
        a: "Usually the brass seat the washer presses against is pitted or worn, so the new washer can't seal. Replace the seat with a seat wrench, or smooth it with a seat-grinding tool if it isn't removable. Also check that the washer is the right size and that you're not overtightening the handle.",
      },
      {
        q: "Should I repair or replace a leaky faucet?",
        a: "Repair it if the faucet is otherwise in good shape and parts are available: a washer, O-rings or a cartridge costs $5 to $60. Replace it if the body is corroded or cracked, it leaks in several places, or parts are hard to find. A new mid-range faucet installed by a plumber typically costs $250 to $800.",
      },
      {
        q: "How do I know what kind of faucet I have?",
        a: "Two handles that turn several times and crank down to close are compression faucets. A single handle on a rounded, dome-shaped cap that moves in every direction is a ball faucet. A single lever over a wide, round cylinder is usually a ceramic disc faucet. Most other single-handle faucets, and two-handle faucets that stop after a quarter or half turn, use a cartridge.",
      },
    ],
  },
  {
    slug: "frozen-pipes",
    title: "Frozen pipes: how to thaw them safely and what to do if one bursts",
    metaTitle: "Frozen Pipes? How to Thaw Safely and What to Do If One Bursts",
    metaDescription:
      "No water in freezing weather usually means a frozen pipe. Where pipes freeze, how to thaw one safely, what to do if it bursts, and what repairs cost.",
    symptom: "Frozen pipes",
    category: "plumbing",
    reviewed: "2026-09-28",
    quickAnswer:
      "No water or only a trickle from a faucet in freezing weather usually means a pipe has frozen, most often under a sink or in a wall on an outside wall, or in a crawl space, garage or attic. Find your main shut-off first, then open the faucet and warm the pipe with a hair dryer, heating pad or warm towels, starting nearest the faucet. Never use an open flame, torch or propane heater. If a pipe has split, shut off the main and call a plumber: a burst pipe repair typically runs $200 to $1,000, plus drywall and cleanup if it's in a wall.",
    severity: "urgent",
    severityNote:
      "A frozen pipe can split and flood the house as it thaws, so deal with it today. Leaving the faucet closed lets pressure build behind the ice. It becomes 'stop and call a pro now' once a pipe has burst or water is near wiring.",
    verdict: "diy_if_handy",
    verdictNote:
      "Thawing a pipe you can reach with gentle heat is DIY. A frozen section you can't find or reach, and any split or burst pipe, are for a plumber.",
    safety: [
      "A pipe has burst, or water is spraying or pouring: shut off the main water valve, turn off the water heater (its breaker, or the gas control to Pilot or Off), and call a plumber.",
      "Water is near outlets, fixtures, appliances or the electrical panel: switch off the breaker for that area from a dry spot. If you'd have to stand in water to reach the panel, stay out and call an electrician or your utility.",
      "A ceiling is sagging or bulging with water: keep everyone out from under it. It can come down suddenly.",
      "Never thaw a pipe with a torch, open flame, or propane or kerosene heater: they can start a fire inside the wall, and fuel-burning heaters indoors can fill the house with carbon monoxide.",
    ],
    causes: [
      {
        cause: "Pipes under a sink on an outside wall",
        howToTell:
          "One kitchen or bathroom sink against an exterior wall has no water or a trickle. The pipes in the cabinet feel ice cold or have frost on them.",
        fix: "Open the cabinet doors and warm the pipes with a hair dryer or heating pad, starting at the faucet end. Later, seal gaps where the pipes come through the wall and insulate them.",
      },
      {
        cause: "Pipe inside an exterior wall",
        howToTell:
          "A fixture on an outside wall is dry, but the pipes you can see under it aren't frozen. Often a bathroom or laundry on the cold, windward side of the house.",
        fix: "Raise the heat, open the faucet, and run a space heater in the room at a safe distance from the wall. If it won't thaw, a plumber can thaw it or open the wall. It may need insulation or rerouting.",
      },
      {
        cause: "Crawl space or unheated basement",
        howToTell:
          "Several fixtures are dry at once, or the whole house is. Exposed pipes may have frost on them, and a crawl space vent or door may be open or broken. If the whole house is dry, ask a neighbor first: it may be the water supply.",
        fix: "Close crawl space vents and doors, and warm the exposed pipes with a hair dryer or heating pad. Insulate those pipes before the next cold snap.",
      },
      {
        cause: "Pipes in a garage or attic",
        howToTell:
          "Fixtures fed by pipes that run through an unheated garage, an attic or the floor over a garage are dry. Often after the garage door was left open.",
        fix: "Keep the garage door closed, warm the pipe where you can reach it, and add insulation or UL-listed heat tape to that run.",
      },
      {
        cause: "Pipe has already split",
        howToTell:
          "Water appears as it thaws: dripping, spraying, a wet spot on a wall or ceiling, or water on the floor. You may see a bulge or a lengthwise split in the pipe.",
        fix: "Shut off the main right away and call a plumber to replace the damaged section. Freezing can split a pipe in more than one place, so have the whole run checked.",
      },
    ],
    tryFirst: [
      "Find the main water shut-off and make sure it turns before you thaw anything. It's usually where the water line enters the house, in a basement, crawl space, garage or utility closet, or outside near the meter.",
      "Open the faucet that isn't working, hot and cold, so melting ice can flow out and pressure can escape.",
      "Open the cabinet doors under sinks on outside walls and turn the heat up a few degrees.",
      "Trace the pipe back from the faucet and look for frost or the coldest spot. Warm it with a hair dryer, heating pad or towels soaked in hot water, starting nearest the faucet and working back toward the ice.",
      "For a pipe you can't reach, run a space heater in the room at least 3 feet from anything that can burn, away from water, and never unattended.",
      "Keep going until full pressure returns, then check along the pipe for drips and check every other faucet in the house.",
    ],
    callAPro: [
      "A pipe has split, or water shows up in a wall, ceiling or floor as it thaws.",
      "You can't find or reach the frozen section.",
      "The water doesn't come back after an hour or so of steady, gentle heat.",
      "The same pipe freezes every cold snap.",
    ],
    costs: [
      { job: "Thaw a frozen pipe", diy: "$0–$30", pro: "$150–$600" },
      { job: "Foam insulation for exposed pipes", diy: "$10–$60", pro: "$150–$600" },
      { job: "UL-listed heat tape on an accessible pipe", diy: "$30–$100", pro: "$150–$500" },
      { job: "Repair a burst pipe you can reach", diy: "Not recommended", pro: "$200–$1,000" },
      { job: "Repair a burst pipe inside a wall or ceiling, plus drywall", diy: "Not recommended", pro: "$600–$2,500+" },
      { job: "Water damage cleanup and drying", diy: "—", pro: "$1,000–$5,000+" },
    ],
    tellThePro:
      "The [kitchen / bathroom / laundry / whole house] has had [no water / only a trickle] since the temperature dropped to about [temperature]. I think the pipe froze [under the sink on an outside wall / in the crawl space / in the garage / inside a wall]. I've [opened the faucet / used a hair dryer / run a space heater] for [time]. I [do / don't] see water leaking, and I [have / haven't] shut off the main. If a pipe has split, does your price include opening the wall, and who handles the drywall? Can you insulate or reroute it so it doesn't freeze again?",
    faqs: [
      {
        q: "How do I know if my pipes are frozen?",
        a: "No water or only a trickle from a faucet during freezing weather is the main sign, especially at a sink on an outside wall. You may also see frost on an exposed pipe or a bulge in it. If only one fixture is dry, the frozen spot is on the pipe that feeds it.",
      },
      {
        q: "How do I thaw a frozen pipe safely?",
        a: "Open the faucet, then warm the pipe with a hair dryer, heating pad or towels soaked in hot water, starting nearest the faucet and working back. Keep going until full pressure returns. Never use a torch, open flame or propane heater, and keep electric heaters and hair dryers away from standing water.",
      },
      {
        q: "What should I do if a frozen pipe bursts?",
        a: "Shut off the main water valve right away, then turn off the water heater and switch off the breaker for any area where water is near wiring or outlets. Call a plumber, move belongings out of the water, and photograph the damage before cleanup for your insurance claim.",
      },
      {
        q: "How do I keep pipes from freezing?",
        a: "Let faucets on outside walls drip on the coldest nights, open the cabinet doors under sinks, and keep the heat at 55°F or higher, even when you're away. Disconnect garden hoses and shut off and drain outdoor faucets before the first freeze. Insulate exposed pipes in crawl spaces, garages and attics, and use UL-listed heat tape, installed exactly as its instructions say, on pipes that freeze anyway.",
      },
    ],
  },
  {
    slug: "lights-flickering",
    title: "Lights flickering or dimming: when it's the bulb and when it's the wiring",
    metaTitle: "Lights Flickering or Dimming? Causes, Danger Signs and Costs",
    metaDescription:
      "Flickering lights are often a loose bulb or an LED on an old dimmer, but can mean a loose connection or failing neutral. What to check, danger signs and costs.",
    symptom: "Lights flickering",
    category: "electrical",
    reviewed: "2026-09-28",
    quickAnswer:
      "When one light flickers, it's usually a loose or failing bulb, or LED bulbs on an old dimmer that wasn't made for them: tighten or swap the bulb, or fit an LED-rated dimmer for $15 to $60. A brief dip when a big appliance starts is normal. Flicker on several lights, or that new bulbs don't fix, points to a worn switch or a loose connection that can overheat, typically $150 to $400 for an electrician to find and fix. If the whole house flickers, or some lights brighten while others dim, call the utility and an electrician right away.",
    severity: "fix_soon",
    severityNote:
      "One flickering bulb is a nuisance. Flicker on a whole circuit or the whole house can mean a loose connection that heats up and can start a fire. With heat, buzzing, a burning smell, or lights getting brighter, it's 'stop and call a pro now'.",
    verdict: "diy_if_handy",
    verdictNote:
      "Tightening or replacing bulbs is DIY. Swapping a dimmer or switch is doable if you can turn off the breaker and confirm the power is off with a tester. Loose connections in boxes, the panel and the service are for a licensed electrician, and the lines and meter are the utility's.",
    safety: [
      "Lights across the house flicker and some get brighter while others dim, often when a big appliance starts: that's the classic sign of a loose or failing neutral. Call your utility and an electrician right away and unplug electronics. If lights go very bright or appliances act strangely, switch off the main breaker until it's checked.",
      "A burning smell, buzzing or sizzling, or a switch plate or outlet that's discolored or warm to the touch (a dimmer can be slightly warm, but never hot): switch off that circuit's breaker and call an electrician.",
      "Sparks, smoke or scorch marks at a switch, outlet, fixture or the panel: switch off the breaker if you can do it safely and call an electrician. If there's smoke or flame, get out and call 911.",
    ],
    causes: [
      {
        cause: "Loose or failing bulb",
        howToTell:
          "One bulb or fixture flickers while others on the same switch stay steady. It may stop when you tighten the bulb.",
        fix: "With the switch off and the bulb cool, tighten it. If it still flickers, replace it. Cheap LEDs often flicker as they start to fail.",
      },
      {
        cause: "LED bulbs on an old or incompatible dimmer",
        howToTell:
          "Lights on a dimmer flicker, strobe or buzz, mostly at low settings, often right after switching to LEDs. Non-dimmable LEDs flicker on any dimmer.",
        fix: "Use bulbs labeled dimmable, and replace an older dimmer with one rated for LED bulbs. Check the dimmer maker's compatible-bulb list, and adjust its low-end trim if it has one. A dimmer with only one or two LEDs on it may be below its minimum load.",
      },
      {
        cause: "Worn switch or dimmer",
        howToTell:
          "The light flickers when you touch or wiggle the switch, the switch feels loose or crackles, or the flicker started as the switch aged.",
        fix: "Replace the switch or dimmer with the breaker off, or have an electrician do it.",
      },
      {
        cause: "Loose connection in a fixture, outlet or box",
        howToTell:
          "Several lights or outlets on one circuit flicker, sometimes when a door slams or you walk past. New bulbs and a new switch don't help.",
        fix: "An electrician finds and remakes the connection at the fixture, switch, outlet or junction box. Push-in (backstab) connections on outlets are a common culprit.",
      },
      {
        cause: "Overloaded circuit or big appliances starting",
        howToTell:
          "Lights dim when the AC, a space heater, a microwave or a vacuum starts. A quick dip that recovers right away is normal. Dimming that's deep, lasts, or keeps happening isn't.",
        fix: "Move space heaters and other heavy loads to other circuits. An electrician can add a dedicated circuit or check for a loose connection.",
      },
      {
        cause: "Loose service connection or failing neutral",
        howToTell:
          "Lights flicker or dim all over the house, not just one room, often worse in wind or when big appliances start. Some lights may get brighter while others dim.",
        fix: "Call the utility first: they're generally responsible for the lines to your house and the meter. The meter base, the service cable on your house and the panel are usually yours and need a licensed electrician. Rules vary by utility.",
      },
    ],
    tryFirst: [
      "Figure out how far it goes: one bulb, one fixture, one room or circuit, or the whole house.",
      "For one light, turn it off, let the bulb cool, and tighten it. If it still flickers, try a new bulb.",
      "On a dimmer, check the bulbs are labeled dimmable and turn the dimmer all the way up. Flicker only at low settings means the dimmer and bulbs don't match.",
      "Note when it happens: when an appliance starts, when you touch the switch, in wind, or at random.",
      "Feel switch plates and outlet covers near the flicker with the back of your hand. Anything hot, discolored, buzzing or smelling hot: switch off that breaker and call an electrician.",
      "If the whole house flickers or some lights get brighter, call the utility and an electrician now.",
    ],
    callAPro: [
      "New bulbs and an LED-rated dimmer don't stop it.",
      "Several lights or outlets on one circuit flicker, or flicker when you bump a wall or switch.",
      "Lights dim hard, or for more than a moment, whenever an appliance starts.",
      "The whole house flickers, or some lights get brighter while others dim.",
      "Any heat, buzzing, discoloration, burning smell or sparks.",
    ],
    costs: [
      { job: "Replace a bulb", diy: "$3–$15", pro: "—" },
      { job: "Replace a dimmer with an LED-rated one", diy: "$15–$60", pro: "$100–$250" },
      { job: "Electrician diagnostic visit", diy: "—", pro: "$100–$300" },
      { job: "Find and fix a loose connection", diy: "Not recommended", pro: "$150–$400" },
      { job: "Repair the meter base or service entrance cable", diy: "Not recommended", pro: "$500–$3,000" },
      { job: "Panel upgrade", diy: "Not recommended", pro: "$1,800–$5,000" },
    ],
    tellThePro:
      "The lights in [one fixture / one room / the whole house] flicker [all the time / when (appliance) starts / when I touch the switch / in wind or rain]. They're [LED / incandescent] bulbs on a [regular switch / dimmer]. I've [replaced the bulbs / replaced the dimmer / called the utility]. Some lights [do / don't] get brighter while others dim, and I [have / haven't] noticed heat, buzzing or a burning smell. What will you check first, and will you give me a price before any panel or service work?",
    faqs: [
      {
        q: "Why are my lights flickering?",
        a: "One flickering light is usually a loose or failing bulb, or an LED on a dimmer that isn't compatible with it. Flicker on several lights, or that new bulbs don't fix, points to a worn switch or a loose connection, which can overheat and should be checked by an electrician. If it comes with heat, buzzing or a burning smell, switch off that breaker first.",
      },
      {
        q: "Why are all the lights in my house flickering?",
        a: "Whole-house flicker usually points to the service: a loose connection at the meter, the service cable or the main panel, or a failing neutral. Call your electric utility first, since they're generally responsible for the lines and the meter, and have an electrician check your side. If some lights get brighter while others dim, treat it as urgent and unplug electronics until it's fixed.",
      },
      {
        q: "Is it normal for lights to dim when the AC turns on?",
        a: "A brief, slight dip when a big motor like an AC starts is common and usually harmless. If the dimming is deep, lasts more than a moment, or keeps getting worse, have an electrician check for an overloaded circuit or a loose connection.",
      },
      {
        q: "Why do my LED lights flicker on a dimmer?",
        a: "Most often the dimmer was designed for incandescent bulbs, or the bulbs aren't dimmable. Use bulbs labeled dimmable and a dimmer rated for LEDs, and check the dimmer maker's list of compatible bulbs. Many LED dimmers also have a trim setting that fixes flicker at the low end.",
      },
    ],
  },
  {
    slug: "outdoor-faucet-leaking",
    title: "Outdoor faucet leaking: fix a dripping spigot or a leak inside the wall",
    metaTitle: "Outdoor Faucet Leaking? Spigot Fixes, Hidden Leaks and Costs",
    metaDescription:
      "A dripping hose bib usually needs a washer, packing or vacuum breaker. How to spot a frost-free spigot that split inside the wall, and what a plumber charges.",
    symptom: "Outdoor faucet leaking",
    category: "outdoor",
    reviewed: "2026-09-28",
    quickAnswer:
      "Where it leaks tells you the fix. A leak at the hose threads is a worn hose washer. A drip from the spout with the handle closed is a worn washer inside the spigot, and a leak around the handle is loose packing. Water from the cap on top is a worn vacuum breaker. Those are DIY fixes for $5 to $30. If water shows up in the basement or wall when the spigot runs, a frost-free sillcock has probably split from freezing with a hose attached: shut off its interior valve and call a plumber. Replacing one typically runs $200 to $500.",
    severity: "fix_soon",
    severityNote:
      "A drip outside wastes water but isn't urgent. Water leaking into the wall or basement when the spigot runs is urgent: it can rot framing and grow mold where you can't see it.",
    verdict: "diy_if_handy",
    verdictNote:
      "Hose washers, packing nuts, stem washers and vacuum breakers are DIY with a wrench and a screwdriver. Replacing a spigot is a handy job only if it's threaded on and you can reach the pipe inside. Soldered connections and leaks inside the wall are for a plumber.",
    safety: [
      "Water shows up inside the wall, basement or ceiling when the spigot is on: stop using it, shut off its interior valve or the main, and call a plumber.",
      "Water is near an outlet, wiring or the panel in the basement: switch off that breaker from a dry spot before you go near it.",
    ],
    causes: [
      {
        cause: "Worn hose washer",
        howToTell:
          "Water sprays or drips from the threads where the hose screws on, only while the hose is attached and the water is on.",
        fix: "Replace the rubber washer inside the hose coupling and hand-tighten the hose.",
      },
      {
        cause: "Worn stem washer",
        howToTell: "Water keeps dripping from the spout with the handle closed tight.",
        fix: "Shut off the water to the spigot, unscrew the packing nut, pull the stem and replace the washer and its brass screw. On a frost-free sillcock the washer is at the end of a long stem, so the whole stem comes out. If it still drips, the seat is worn and the spigot needs replacing.",
      },
      {
        cause: "Loose packing nut or worn packing",
        howToTell: "Water seeps out around the stem, just behind the handle, while the spigot is on.",
        fix: "Tighten the packing nut behind the handle about a quarter turn. If that doesn't stop it, replace the packing or the stem O-ring.",
      },
      {
        cause: "Worn vacuum breaker",
        howToTell:
          "Water leaks or spits from the cap on top of the spigot while it's on. A small spurt when you shut it off is normal.",
        fix: "Unscrew the cap and replace the rubber seal, or the whole vacuum breaker. Don't remove it for good: it stops hose water from siphoning back into your drinking water.",
      },
      {
        cause: "Frost-free sillcock split inside the wall",
        howToTell:
          "The spigot doesn't drip outside, but when it runs, water shows up in the basement, crawl space, wall or ceiling below. Often found in spring after a hose was left attached through a freeze.",
        fix: "Stop using it and shut off its interior valve. The sillcock needs replacing, sloped slightly down toward the outside so it drains, and any wet drywall or insulation needs drying or replacing.",
      },
      {
        cause: "Loose or cracked pipe connection",
        howToTell:
          "Water drips from the pipe or fitting behind the spigot, inside the basement or crawl space, even with the spigot closed.",
        fix: "Shut off the supply. A threaded joint may only need tightening or fresh thread sealant. A cracked pipe or fitting needs a plumber.",
      },
    ],
    tryFirst: [
      "Run the spigot with and without the hose attached and watch where the water comes out: the hose threads, the spout, around the handle, or the cap on top.",
      "While it runs, check inside the basement, crawl space or the wall behind it. If you find water, shut the spigot off and close its interior valve.",
      "For a leak at the hose threads, replace the hose washer and hand-tighten the hose.",
      "For a leak around the handle, snug the packing nut behind the handle a quarter turn with a wrench.",
      "For a drip from the spout, shut off the spigot's interior valve or the main and open the spigot to drain it. Then pull the stem and take it to the store to match the washer.",
    ],
    callAPro: [
      "Water appears inside the house, wall or basement when the spigot runs.",
      "It still drips after a new washer, which usually means the seat is worn.",
      "The spigot or the pipe behind it is cracked, or it's soldered on and needs replacing.",
      "The spigot has no interior shut-off and the main valve is stuck or hard to reach.",
    ],
    costs: [
      { job: "Replace a hose washer", diy: "$1–$5", pro: "—" },
      { job: "Replace a stem washer or packing", diy: "$5–$15", pro: "$100–$250" },
      { job: "Replace a vacuum breaker", diy: "$10–$30", pro: "$100–$250" },
      { job: "Replace a standard spigot", diy: "$15–$40", pro: "$150–$350" },
      { job: "Replace a frost-free sillcock", diy: "$25–$70", pro: "$200–$500" },
      { job: "Repair a split pipe inside the wall, plus drywall", diy: "Not recommended", pro: "$500–$2,000+" },
    ],
    tellThePro:
      "My outdoor faucet on the [front / back / side] of the house leaks from [the spout / around the handle / the cap on top / inside the wall or basement when it's on]. It's a [standard / frost-free] spigot, about [age] years old, and a hose [was / wasn't] left attached over the winter. It [has / doesn't have] its own shut-off valve inside, and I've [closed it / shut off the main]. Can you replace it with a frost-free model? Does your price include opening the wall if the pipe inside is damaged, and who handles the drywall?",
    faqs: [
      {
        q: "Why is water leaking into my basement when I use the outside faucet?",
        a: "It's usually a frost-free sillcock that split inside the wall. Its valve sits at the inside end of a long tube, so a crack in that tube only leaks when the valve is open. It usually happens when a hose is left attached in freezing weather, trapping water that freezes and splits the tube. Stop using it, shut off its interior valve, and have it replaced.",
      },
      {
        q: "How do I stop an outdoor faucet from dripping?",
        a: "If it drips from the spout with the handle closed, the washer on the end of the stem is worn. Shut off the water to the spigot, unscrew the packing nut, pull the stem and replace the washer. If it still drips, the seat is worn and the spigot needs replacing.",
      },
      {
        q: "Is it normal for water to come out of the top of an outdoor faucet?",
        a: "A small spurt from the vacuum breaker cap when you shut the water off is normal. Water that leaks or sprays from it while the faucet is on means the seal is worn. Replace the seal or the vacuum breaker, but don't remove it: it keeps hose water from siphoning back into your drinking water.",
      },
      {
        q: "How do I winterize an outdoor faucet?",
        a: "Before the first freeze, disconnect the hose and any splitters, even from a frost-free faucet. If it has an interior shut-off valve, close it, then open the outdoor faucet to drain it and leave it open for the winter. If the interior valve has a small drain cap, open it over a bucket to empty the pipe. An insulated faucet cover adds a little extra protection.",
      },
    ],
  },
];

export type GuideGroup = { anchor: string; label: string; emoji: string; guides: Guide[] };

/**
 * Guides grouped by trade, in the same order as the category chips on
 * /diagnose, with uncategorized ones last. Empty groups are left out.
 */
export function guidesByCategory(guides: Guide[] = GUIDES): GuideGroup[] {
  const groups: GuideGroup[] = CATEGORIES.filter((c) => c.id !== "not_sure").map((c) => ({
    anchor: c.id.replace(/_/g, "-"),
    label: c.label,
    emoji: c.emoji,
    guides: guides.filter((g) => g.category === c.id),
  }));
  groups.push({
    anchor: "other",
    label: "Other problems",
    emoji: "🏡",
    guides: guides.filter((g) => !g.category || g.category === "not_sure"),
  });
  return groups.filter((g) => g.guides.length > 0);
}

export function getGuide(slug: string): Guide | undefined {
  return GUIDES.find((g) => g.slug === slug);
}

/** "September 27, 2026" from an ISO date, independent of the server's time zone. */
export function formatReviewed(date: string): string {
  return new Date(`${date}T12:00:00Z`).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  });
}
