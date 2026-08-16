import { ProtectedRoute } from "./ProtectedRoute";
import {
  Chronicle,
  ChronicleAccessNotice,
} from "@/features/chronicle/ChroniclePage";
import { ChronicleFrame } from "@/features/chronicle/ChronicleFrame";

/** The room is public; private activity is fetched only after authentication. */
export function ChronicleRoute() {
  return (
    <ChronicleFrame>
      <ProtectedRoute signedOut={<ChronicleAccessNotice />}>
        <Chronicle />
      </ProtectedRoute>
    </ChronicleFrame>
  );
}
