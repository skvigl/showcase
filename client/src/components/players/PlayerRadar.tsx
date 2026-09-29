"use client";

import { useMemo } from "react";
import useSWR from "swr";
import ReactECharts from "echarts-for-react";

import { API } from "@/api";
import { fetcher } from "@/utils";
import { TOURNAMENT_ID } from "@/constants";
import { PlayerStatsOverview } from "@/types/stats";
import { Preloader } from "@/shared/Preloader";

export const PlayerRadar = ({ id }: { id: string }) => {
  const { data, isLoading } = useSWR<PlayerStatsOverview | null>(
    id ? API.players.overviewStats(id, { tournamentId: TOURNAMENT_ID }) : null,
    fetcher,
  );

  const option = useMemo(() => {
    if (!data) return {};

    const player = data.player;
    const max = data.max;
    const color = "#005f78";

    return {
      color: [color],
      tooltip: {
        trigger: "item",
        confine: true,
        borderColor: color,
      },
      radar: {
        center: ["50%", "55%"],
        radius: "80%",
        indicator: [
          { name: "Score", max: max.score || 1 },
          { name: "Move", max: max.move || 1 },
          { name: "Knockout", max: max.knockout || 1 },
          { name: "Grab", max: max.grab || 1 },
          { name: "Steal", max: max.steal || 1 },
        ],
      },
      series: [
        {
          type: "radar",
          symbol: "none",
          data: [
            {
              value: [player.score, player.move, player.knockout, player.grab, player.steal],
              name: "Player",
              lineStyle: {
                color: color,
                width: 2,
                opacity: 0.9,
              },
              areaStyle: {
                color: color,
                opacity: 0.5,
              },
            },
          ],
        },
      ],
    };
  }, [data]);

  if (isLoading) {
    return <Preloader />;
  }

  if (!data) {
    return null;
  }

  return (
    <>
      <ReactECharts option={option} style={{ width: "100%", height: "100%" }} />
    </>
  );
};
