import Image from "next/image";

type InstructorPanelProps = {
    imageSrc?: string;
    imageAlt?: string;
    name?: string;
};

export default function InstructorPanel({
    imageSrc = "/mayank_feature_img.png",
    imageAlt = "Mayank Kumar",
    name = "Mayank Kumar",
}: InstructorPanelProps) {
    return (
        <div className="relative order-2 lg:order-2 flex justify-center lg:justify-end">
            <div className="relative w-full max-w-xl">
                {/* Background Circles */}
                <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-64 h-64 md:w-80 md:h-80 lg:w-[26rem] lg:h-[26rem] rounded-full border-2 border-gray-200 opacity-30"></div>
                    <div className="absolute w-48 h-48 md:w-64 md:h-64 lg:w-80 lg:h-80 rounded-full border-2 border-gray-200 opacity-30"></div>
                </div>

                {/* Instructor Photo and Details */}
                <div className="relative z-10 flex flex-col items-center gap-6">
                    <div className="relative w-40 h-40 md:w-56 md:h-56 lg:w-72 lg:h-72">
                        <div className="relative w-full h-full rounded-full overflow-hidden shadow-xl border-[3px] border-blue-500">
                            <Image
                                src={imageSrc}
                                alt={imageAlt}
                                fill
                                priority
                                sizes="(min-width: 1024px) 18rem, (min-width: 768px) 14rem, 10rem"
                                className="object-cover object-top"
                            />
                        </div>

                        {/* Social Proof Cards */}
                        {/* <div className="absolute top-8 left-[70%] sm:left-[80%] lg:left-[85%] z-20 -translate-x-4">
                            <Card className="bg-white border-2 border-blue-500 shadow-lg p-2 md:p-3 whitespace-normal sm:whitespace-nowrap">
                                <CardContent className="p-0 flex items-center space-x-2">
                                    <GraduationCap className="w-4 h-4 md:w-5 md:h-5 text-blue-600" />
                                    <span className="text-xs md:text-sm font-semibold text-gray-800">
                                        {LEARNERS_COUNT} Students Enrolled
                                    </span>
                                </CardContent>
                            </Card>
                        </div> */}
                    </div>

                    {/* Name and Title */}
                    <div className="rounded-xl border border-blue-100/80 bg-white/80 px-4 py-2.5 shadow-sm backdrop-blur-sm">
                        <h3 className="text-base md:text-lg font-semibold tracking-tight text-blue-700 text-center">
                            {name}
                        </h3>
                    </div>
                </div>
            </div>
        </div>
    );
}
