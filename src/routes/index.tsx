import { createFileRoute } from "@tanstack/react-router";
import FeelingsConstellation from "@/components/FeelingsConstellation";

export const Route = createFileRoute("/")({
  component: Index,
  head: () => ({
    meta: [
      { title: "Feelings Constellation — A gentle neurodivergent check-in" },
      {
        name: "description",
        content:
          "A calm, interactive map for exploring how you feel — designed for neurodivergent minds. Soft, spacious, and emotionally validating.",
      },
      { property: "og:title", content: "Neurodivergent Feelings Constellation" },
      {
        property: "og:description",
        content: "Gently explore your internal world. A soft, interactive emotional check-in.",
      },
    ],
  }),
});

function Index() {
  return <FeelingsConstellation />;
}
