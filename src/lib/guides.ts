import type { CategoryId, DiyVerdict, Severity } from "@/lib/diagnosis-meta";

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
];

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
