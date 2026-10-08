import { NookHalloweenRoom } from "./NookHalloweenRoom";
import { NookHalloweenHearth } from "./NookHalloweenHearth";
import {
  NookHalloweenBadge,
  NookHalloweenNote,
} from "./NookHalloweenKeepsakes";

const decorations = {
  room: NookHalloweenRoom,
  hearth: NookHalloweenHearth,
  badge: NookHalloweenBadge,
  letter: NookHalloweenNote,
};

/** The holiday's details share one chunk and keep their existing placements. */
export default function NookHalloweenDetails({
  placement,
}: {
  placement: keyof typeof decorations;
}) {
  const Decoration = decorations[placement];
  return <Decoration />;
}
