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
    metaTitle: "Toilet Keeps Running? The 4 Usual Causes and How to Fix Each",
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
    metaTitle: "AC Running but Not Cooling? 6 Checks and Repair Costs",
    metaDescription:
      "AC running but blowing warm air? The checks you can do yourself (filter, thermostat, breaker, outdoor coil, ice), the repairs that need a tech, and typical costs.",
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
      "Most drywall cracks are cosmetic settling you can patch for under $30. The signs that point to a structural problem, how to monitor a crack, and what repairs cost.",
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
