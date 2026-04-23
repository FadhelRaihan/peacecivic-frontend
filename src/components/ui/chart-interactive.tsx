"use client"

import * as React from "react"
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts"

import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import {
    ChartContainer,
    ChartLegend,
    ChartLegendContent,
    ChartTooltip,
    ChartTooltipContent,
    type ChartConfig,
} from "@/components/ui/chart"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

const chartConfig = {
    activity: {
        label: "Aktivitas",
    },
    student: {
        label: "Aktivitas Pejuang",
        color: "#800000",
    },
    teacher: {
        label: "Aktivitas Guru",
        color: "#D4AF37",
    },
} satisfies ChartConfig

interface ChartProps {
    data: any[];
}

export function ChartAreaInteractive({ data }: ChartProps) {
    const [timeRange, setTimeRange] = React.useState("90d")

    const filteredData = data.filter((item) => {
        const date = new Date(item.date)
        const referenceDate = new Date()
        let daysToSubtract = 90
        if (timeRange === "30d") {
            daysToSubtract = 30
        } else if (timeRange === "7d") {
            daysToSubtract = 7
        }
        const startDate = new Date(referenceDate)
        startDate.setDate(startDate.getDate() - daysToSubtract)
        return date >= startDate
    })

    return (
        <Card className="pt-0 px-2 border-none shadow-2xl shadow-gray-200/50 rounded-2xl overflow-hidden bg-white/40 backdrop-blur-sm">
            <CardHeader className="flex flex-col md:flex-row items-center gap-2 space-y-0 border-b border-gray-50 py-5">
                <div className="grid flex-1 gap-1">
                    <CardTitle className="text-md md:text-xl font-black uppercase tracking-tight text-gray-900">Grafik Interaksi Platform</CardTitle>
                    <CardDescription className="text-xs font-medium italic">
                        Membandingkan intensitas aktivitas Pejuang (Siswa) dan Guru Pembimbing.
                    </CardDescription>
                </div>
                <Select value={timeRange} onValueChange={setTimeRange}>
                    <SelectTrigger
                        className="md:w-[160px] w-full rounded-xl sm:ml-auto h-10 border-2 border-gray-100 font-bold text-xs"
                        aria-label="Pilih Rentang Waktu"
                    >
                        <SelectValue placeholder="3 Bulan Terakhir" />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl border-none shadow-2xl">
                        <SelectItem value="90d" className="rounded-lg font-bold text-xs">
                            3 Bulan Terakhir
                        </SelectItem>
                        <SelectItem value="30d" className="rounded-lg font-bold text-xs">
                            30 Hari Terakhir
                        </SelectItem>
                        <SelectItem value="7d" className="rounded-lg font-bold text-xs">
                            7 Hari Terakhir
                        </SelectItem>
                    </SelectContent>
                </Select>
            </CardHeader>
            <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
                <ChartContainer
                    config={chartConfig}
                    className="aspect-auto h-[350px] w-full"
                >
                    <AreaChart data={filteredData}>
                        <defs>
                            <linearGradient id="fillStudent" x1="0" y1="0" x2="0" y2="1">
                                <stop
                                    offset="5%"
                                    stopColor="#800000"
                                    stopOpacity={0.4}
                                />
                                <stop
                                    offset="95%"
                                    stopColor="#800000"
                                    stopOpacity={0}
                                />
                            </linearGradient>
                            <linearGradient id="fillTeacher" x1="0" y1="0" x2="0" y2="1">
                                <stop
                                    offset="5%"
                                    stopColor="#D4AF37"
                                    stopOpacity={0.4}
                                />
                                <stop
                                    offset="95%"
                                    stopColor="#D4AF37"
                                    stopOpacity={0}
                                />
                            </linearGradient>
                        </defs>
                        <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="#f0f0f0" />
                        <XAxis
                            dataKey="date"
                            tickLine={false}
                            axisLine={false}
                            tickMargin={12}
                            minTickGap={32}
                            tick={{ fontSize: 10, fontWeight: 700, fill: '#94a3b8' }}
                            tickFormatter={(value) => {
                                const date = new Date(value)
                                return date.toLocaleDateString("id-ID", {
                                    month: "short",
                                    day: "numeric",
                                })
                            }}
                        />
                        <ChartTooltip
                            cursor={false}
                            content={
                                <ChartTooltipContent
                                    labelFormatter={(value) => {
                                        return new Date(value).toLocaleDateString("id-ID", {
                                            day: "numeric",
                                            month: "long",
                                            year: "numeric"
                                        })
                                    }}
                                    indicator="dot"
                                />
                            }
                        />
                        <Area
                            dataKey="teacher"
                            type="monotone"
                            fill="url(#fillTeacher)"
                            stroke="#D4AF37"
                            strokeWidth={3}
                            stackId="a"
                        />
                        <Area
                            dataKey="student"
                            type="monotone"
                            fill="url(#fillStudent)"
                            stroke="#800000"
                            strokeWidth={3}
                            stackId="a"
                        />
                        <ChartLegend content={<ChartLegendContent />} />
                    </AreaChart>
                </ChartContainer>
            </CardContent>
        </Card>
    )
}
