import { useEffect } from "react";

const PULL_THRESHOLD_PX = 72;
const RELOAD_CONFIRMATION_MS = 2500;

export default function TopPullRefresh() {
    useEffect(() => {
        let startPoint: { x: number; y: number } | null = null;
        let maxPullDistance = 0;
        let reloadArmed = false;
        let resetTimer: number | undefined;

        const clearReloadArm = () => {
            reloadArmed = false;
            window.clearTimeout(resetTimer);
        };

        const startsInScrollableArea = (target: EventTarget | null) => {
            if (!(target instanceof Element)) return false;
            if (target.closest("a, button, input, select, textarea, [contenteditable='true']")) return true;

            for (let element: Element | null = target; element && element !== document.body; element = element.parentElement) {
                const { overflowY } = window.getComputedStyle(element);
                const isScrollable = overflowY === "auto" || overflowY === "scroll";

                if (isScrollable && element.scrollHeight > element.clientHeight) return true;
            }

            return false;
        };

        const handleTouchStart = (event: TouchEvent) => {
            if (event.touches.length !== 1 || window.scrollY > 0) {
                startPoint = null;
                if (window.scrollY > 0) clearReloadArm();
                return;
            }

            if (startsInScrollableArea(event.target)) {
                startPoint = null;
                return;
            }

            const touch = event.touches[0];
            startPoint = { x: touch.clientX, y: touch.clientY };
            maxPullDistance = 0;
        };

        const handleTouchMove = (event: TouchEvent) => {
            if (!startPoint || event.touches.length !== 1 || window.scrollY > 0) return;

            const touch = event.touches[0];
            const deltaY = touch.clientY - startPoint.y;
            const deltaX = Math.abs(touch.clientX - startPoint.x);

            if (deltaY > deltaX) {
                maxPullDistance = Math.max(maxPullDistance, deltaY);
                if (event.cancelable) event.preventDefault();
            }
        };

        const handleTouchEnd = () => {
            startPoint = null;
            if (maxPullDistance < PULL_THRESHOLD_PX) return;

            if (reloadArmed) {
                window.location.reload();
                return;
            }

            reloadArmed = true;
            const root = document.getElementById("root");
            root?.classList.remove("top-pull-bounce");
            requestAnimationFrame(() => root?.classList.add("top-pull-bounce"));
            resetTimer = window.setTimeout(clearReloadArm, RELOAD_CONFIRMATION_MS);
        };

        const handleTouchCancel = () => {
            startPoint = null;
            maxPullDistance = 0;
        };

        const handleAnimationEnd = (event: AnimationEvent) => {
            if (event.animationName === "top-pull-bounce") {
                document.getElementById("root")?.classList.remove("top-pull-bounce");
            }
        };

        const handleScroll = () => {
            if (window.scrollY > 0) clearReloadArm();
        };

        document.addEventListener("touchstart", handleTouchStart, { passive: true });
        document.addEventListener("touchmove", handleTouchMove, { passive: false });
        document.addEventListener("touchend", handleTouchEnd, { passive: true });
        document.addEventListener("touchcancel", handleTouchCancel, { passive: true });
        document.addEventListener("animationend", handleAnimationEnd);
        window.addEventListener("scroll", handleScroll, { passive: true });

        return () => {
            document.removeEventListener("touchstart", handleTouchStart);
            document.removeEventListener("touchmove", handleTouchMove);
            document.removeEventListener("touchend", handleTouchEnd);
            document.removeEventListener("touchcancel", handleTouchCancel);
            document.removeEventListener("animationend", handleAnimationEnd);
            window.removeEventListener("scroll", handleScroll);
            window.clearTimeout(resetTimer);
            document.getElementById("root")?.classList.remove("top-pull-bounce");
        };
    }, []);

    return null;
}
