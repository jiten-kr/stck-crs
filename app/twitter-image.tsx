import { ImageResponse } from "next/og";

export const runtime = "edge";

export const alt = "MayankFin - Learn Stock Market & Crypto Trading";
export const size = {
    width: 1200,
    height: 630,
};
export const contentType = "image/png";

export default function Image() {
    return new ImageResponse(
        (
            <div
                style={{
                    height: "100%",
                    width: "100%",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    backgroundColor: "#0f172a",
                }}
            >
                <div
                    style={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                        padding: 40,
                    }}
                >
                    <div
                        style={{
                            display: "flex",
                            alignItems: "center",
                            marginBottom: 30,
                        }}
                    >
                        <div
                            style={{
                                width: 60,
                                height: 60,
                                backgroundColor: "#2563eb",
                                borderRadius: 12,
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                marginRight: 16,
                                fontSize: 32,
                            }}
                        >
                            📈
                        </div>
                        <div
                            style={{
                                fontSize: 48,
                                fontWeight: 700,
                                color: "white",
                            }}
                        >
                            MayankFin
                        </div>
                    </div>

                    <div
                        style={{
                            fontSize: 48,
                            fontWeight: 700,
                            color: "white",
                            textAlign: "center",
                            marginBottom: 20,
                        }}
                    >
                        Learn Stock Market & Crypto Trading
                    </div>

                    <div
                        style={{
                            fontSize: 48,
                            fontWeight: 700,
                            color: "#3b82f6",
                            textAlign: "center",
                            marginBottom: 30,
                        }}
                    >
                        the Right Way
                    </div>

                    <div
                        style={{
                            fontSize: 24,
                            color: "#94a3b8",
                            textAlign: "center",
                        }}
                    >
                        Live classes & self-paced courses for beginners
                    </div>
                </div>
            </div>
        ),
        {
            width: 1200,
            height: 630,
        }
    );
}
