import type { TravelContext } from "@/lib/types";
import type { RawTravelPlanParsed } from "@/lib/validation/output";

export function makeContext(overrides: Partial<TravelContext> = {}): TravelContext {
  return {
    destination: "Kyoto, Japan",
    days: 2,
    travelStyle: "cultural",
    residentGuide: "historian",
    budget: 800,
    currency: "USD",
    sustainableFocus: true,
    dietaryRestrictions: "none",
    accessibilityNeeds: "none",
    specialInterests: "temples, green tea",
    ...overrides,
  };
}

export function makeRawPlan(overrides: Partial<RawTravelPlanParsed> = {}): RawTravelPlanParsed {
  return {
    destinationName: "Kyoto, Japan",
    tagline: "Unveiling 1,000 years of imperial history and Zen gardens.",
    culturalOverview: "Kyoto is the cultural heart of Japan, featuring ancient wood temples, traditional shrines, and the legendary geisha district of Gion.",
    heritageScore: 92,
    attractions: [
      {
        name: "Kinkaku-ji (Golden Pavilion)",
        type: "attraction",
        whySelected: "Matches interest in Zen gardens and historical architecture.",
        history: "Originally built in 1397 as a retirement villa for Shogun Ashikaga Yoshimitsu, later converted into a Zen temple.",
        culturalSignificance: "Represents the opulent Muromachi period design and serves as a classic Zen meditation environment.",
        interestingFact: "The top two floors of the pavilion are completely covered in pure gold leaf.",
        bestTime: "Early morning to avoid tourist rushes and catch the sunrise reflection.",
        localTip: "Walk past the main viewing platform quickly to find the quiet moss garden paths behind the pavilion.",
        localSecret: "Wander to the rear stone pagoda to find a natural cold spring where Zen masters brewed ceremonial matcha.",
        travelTips: "Purchase your entry ticket at the automated gates; cash only.",
        nearbyHiddenExperience: "A tiny stone garden hidden behind the head monk's tea room.",
        locationDescription: "Northern Kyoto hills",
        estimatedCost: 10,
        timeRequired: "1.5 hours",
        photoSpot: "Shoot from the south-east corner of the mirror pond for a perfect symmetrical reflection.",
        responsibleTip: "Ensure you take all trash with you; there are no trash bins on the sacred grounds.",
      },
      {
        name: "Gion Shimbashi Craft Alley",
        type: "hidden_gem",
        whySelected: "Perfect for discovering traditional wooden machiya townhouses without crowds.",
        history: "Preserved preservation district dating back to the Edo period.",
        culturalSignificance: "The heart of geisha culture and traditional entertainment architecture.",
        interestingFact: "Many houses still feature the original 'dog fences' designed to keep mud off wood facades.",
        bestTime: "Just before sunset when the stone lanterns are lit.",
        localTip: "Do not photograph geishas on public streets; respect local signage.",
        localSecret: "Walk behind the Shinto shrine to find the workshop of a master wooden lantern builder.",
        travelTips: "Quiet voice zones apply here; avoid shouting or blocking narrow stone alleys.",
        nearbyHiddenExperience: "A small bridge where locals watch fireflies in early summer.",
        locationDescription: "Gion District",
        estimatedCost: 0,
        timeRequired: "1 hour",
        photoSpot: "Capture down the canal from the Shimbashi bridge at twilight.",
        responsibleTip: "Support local shopkeepers by purchasing small goods rather than just taking photos.",
      },
    ],
    walkingRoute: {
      title: "Ancient Shrines & Bamboo Paths",
      totalDurationMinutes: 120,
      waypoints: [
        {
          title: "Yasaka Shrine Entrance",
          description: "Start at the bright vermillion gate facing Shijo street.",
          durationMinutes: 30,
        },
        {
          title: "Kodai-ji Garden Walk",
          description: "Follow the stone pathway up through the bamboo groves.",
          durationMinutes: 45,
        },
      ],
      routePathSvg: "M 20,30 L 100,70 L 180,30",
    },
    localEtiquette: [
      {
        situation: "Visiting Shrines",
        custom: "Bow twice, clap twice, bow once at the altar.",
        residentTip: "Never walk directly down the middle of the path; that is reserved for the deities.",
      },
    ],
    foodRecommendations: [
      {
        name: "Yuba (Tofu Skin) Rice Bowl",
        description: "Delicate sheets of freshly boiled soy milk served over hot rice with a light soy glaze.",
        authenticTip: "Go to the family-run stall behind Kennin-ji temple, open only between 11:30 AM and 2:00 PM.",
        bestTime: "Lunchtime",
        estimatedCost: 15,
      },
    ],
    culturalEvents: [
      {
        name: "Gion Matsuri",
        timeOrSeason: "July",
        significance: "An ancient purification festival dating back to 869 to combat plagues.",
        travelerParticipation: "Walk the vehicle-free streets during Yoiyama evenings to view illuminated floats.",
      },
    ],
    artisanSpotlight: [
      {
        craft: "Kiyomizu-yaki Ceramics",
        masterArtisan: "Kiyomizu Pottery Co-op",
        locationDescription: "Gochazaka Hill paths",
        impactStatement: "Supports 4th generation local potters maintaining wood-fired kilns.",
        estimatedCost: 50,
      },
    ],
    timeline: [
      {
        dayNumber: 1,
        slot: "morning",
        activityTitle: "Golden Reflections at Kinkaku-ji",
        activityDescription: "View the shining pavilion before crowds arrive.",
        localGuideInsight: "Eat a small matcha soft-serve at the garden exit.",
        associatedCost: 10,
      },
      {
        dayNumber: 1,
        slot: "afternoon",
        activityTitle: "Artisan Ceramic Hunt",
        activityDescription: "Browse potters' shops on Gochazaka Hill.",
        localGuideInsight: "Ask to see the kiln rooms; many masters love showing their workflow.",
        associatedCost: 50,
      },
      {
        dayNumber: 1,
        slot: "evening",
        activityTitle: "Lantern-lit Gion Stroll",
        activityDescription: "Observe the preservation streets at dusk.",
        localGuideInsight: "Do not take pictures in private alleys where photography is banned.",
        associatedCost: 15,
      },
    ],
    safetyTips: ["Watch for step slopes on stone paths in Gion.", "Keep cash on hand; small shops don't accept cards."],
    packingItems: ["Comfortable slip-on walking shoes for frequent temple entries.", "A light umbrella for sudden afternoon mountain showers."],
    localPhrases: [
      {
        original: "O-okini",
        phonetic: "Oh-oh-kee-nee",
        meaning: "Thank you (Kyoto dialect)",
      },
    ],
    sustainableRecommendations: ["Use public buses or trains rather than taxis.", "Buy souvenirs from co-ops displaying the heritage mark."],
    localMythsAndLegends: [
      {
        title: "The Legend of the Golden Phoenix",
        story: "The golden phoenix standing atop Kinkaku-ji's roof is believed to watch over Kyoto, spreading its wings to protect the sacred city from fire and sickness.",
        culturalContext: "Symbolizes rebirth and resilience, serving as a powerful reminder of how Kyoto rebuilt itself after countless historical wars.",
      },
    ],
    estimatedTotalCost: 75,
    ...overrides,
  };
}
