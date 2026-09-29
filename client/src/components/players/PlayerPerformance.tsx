"use client";

import { useMemo, useRef } from "react";
import ReactECharts from "echarts-for-react";
import useSWR from "swr";
import { format } from "date-fns";

import { PlayerMatchStats } from "@/types/stats";
import { TOURNAMENT_ID } from "@/constants";
import { API } from "@/api";
import { fetcher } from "@/utils";
import { MatchActionType } from "@/types";
import { Preloader } from "@/shared/Preloader";

const ACTION_CONFIG: Record<MatchActionType, { label: string; color: string }> = {
  score: { label: "Score", color: "#10b981" },
  knockout: { label: "Knockout", color: "#ef4444" },
  steal: { label: "Steal", color: "#f59e0b" },
  grab: { label: "Grab", color: "#64748b" },
  move: { label: "Move", color: "#cbd5e1" },
};

const ACTION_KEYS: MatchActionType[] = ["score", "knockout", "steal", "grab", "move"];

export function PlayerPerformance({ id }: { id: string }) {
  const chartRef = useRef<ReactECharts>(null);

  const { data, isLoading } = useSWR<PlayerMatchStats | null>(
    id ? API.players.matchStats(id, { tournamentId: TOURNAMENT_ID }) : null,
    fetcher,
  );

  const matches = data?.items;

  const chartData = useMemo(() => {
    if (!matches || matches.length === 0) {
      return { dates: [], series: [] };
    }

    const dates = matches.map((m) => format(new Date(m.date), "d MMM"));
    const matchTotals = matches.map((m) => ACTION_KEYS.reduce((sum, key) => sum + (m.actions[key] ?? 0), 0));

    const series = ACTION_KEYS.map((action) => ({
      name: ACTION_CONFIG[action].label,
      type: "bar" as const,
      stack: "totalActions",
      barMaxWidth: 32,
      emphasis: { focus: "series" as const },
      itemStyle: { color: ACTION_CONFIG[action].color },
      data: matches.map((m, i) => {
        const total = matchTotals[i];

        if (!total) return 0;

        const count = m.actions[action] ?? 0;

        return Number(((count / total) * 100).toFixed(1));
      }),
      label: {
        show: true,
        formatter: (params: { value: number }) => (params.value >= 15 ? `${Math.round(params.value)}` : ""),
        color: "#FFFFFF",
        fontSize: 9,
        fontWeight: "bold",
      },
      labelLayout: {
        hideOverlap: true,
      },
    }));

    return { dates, series };
  }, [matches]);

  if (isLoading) {
    return <Preloader />;
  }

  if (!matches) {
    return null;
  }

  const option = {
    tooltip: {
      trigger: "axis",
      confine: true,
      axisPointer: { type: "shadow" },
      valueFormatter: (value: number | string) => `${value}%`,
    },
    legend: {
      type: "scroll",
      top: 0,
      left: "center",
      icon: "circle",
      itemWidth: 8,
      itemHeight: 8,
      itemGap: 10,
      textStyle: {
        fontSize: 11,
      },
      pageIconSize: 10,
      pageButtonGap: 6,
    },
    grid: {
      top: 36,
      left: 0,
      right: 8,
      bottom: 0,
      containLabel: true,
    },
    xAxis: {
      type: "category",
      data: chartData.dates,
      axisTick: { alignWithLabel: true },
    },
    yAxis: {
      type: "value",
      max: 100,
      axisLabel: {
        formatter: "{value}%",
      },
      splitLine: {
        lineStyle: { type: "dashed", opacity: 0.2 },
      },
    },
    series: chartData.series,
  };

  return (
    <>
      <ReactECharts ref={chartRef} option={option} style={{ width: "100%", height: "100%" }} />
    </>
  );
}
