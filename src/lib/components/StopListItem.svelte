<script lang="ts">
  import {
    getETA,
    getETAQueryKey,
    getStop,
    getStopQueryKey
  } from '$lib/api/ctb';

  import { getStop as getKMBStop, getETA as getKmbETA } from '$lib/api/kmb';

  import type { CompanyId, Direction } from '$lib/api/ctb/types';
  import { createQuery } from '@tanstack/svelte-query';
  import LoadingSkeleton from '$lib/components/LoadingSkeleton.svelte';
  import {
    getDifferentInMinutesByTimeStamp,
    isArrivalTimeLessThenOneMinutes,
    sortEta
  } from '$lib/utils/eta';
  import { REFETCH_EVERY_TEN_SECONDS } from '$lib/constants';

  const {
    stopId,
    companyId,
    route,
    showRouteNumber = false,
    direction
  } = $props<{
    stopId: string;
    companyId: CompanyId;
    route: string;
    showRouteNumber?: boolean;
    direction?: Direction;
  }>();

  const stopQuery = $derived(
    createQuery({
      queryKey: [...getStopQueryKey({ stopId }), companyId],
      queryFn: () => {
        return companyId === 'CTB'
          ? getStop({ stopId })
          : getKMBStop({ stop: stopId });
      }
    })
  );

  const etaQuery = $derived(
    createQuery({
      queryKey: getETAQueryKey({
        companyId,
        stopId,
        route
      }),
      refetchInterval: REFETCH_EVERY_TEN_SECONDS,
      queryFn: async () => {
        if (companyId === 'CTB') {
          return getETA({
            companyId,
            stopId,
            route
          });
        }

        const response = await getKmbETA({ stop: stopId });
        return {
          ...response,
          data: response.data.filter((stop: any) => stop.route === route)
        };
      }
    })
  );

  const stopEtas = $derived(sortEta($etaQuery?.data?.data)?.slice(0, 1));
</script>

{#if $etaQuery.isLoading || $stopQuery.isLoading}
  <LoadingSkeleton numberOfSkeletonBar={1} />
{:else if $etaQuery.isError || $stopQuery.isError}
  <p>錯誤發生</p>
{:else if $etaQuery.isSuccess && $stopQuery.isSuccess}
  <a
    href={`/${companyId}/route/${route}/stop/${stopId}${direction ? `?direction=${direction}` : ''}`}
    style:--tag={`stop-item-${stopId}`}
    class={`flex rounded-lg bg-white p-2 shadow-md hover:shadow-lg ${
      showRouteNumber ? 'justify-between' : 'justify-start gap-4'
    } stop-list-grid box-border h-min items-center`}
  >
    <div class="col-span-3">
      <ul>
        {#each stopEtas ?? [] as eta}
          <li>
            {#if isArrivalTimeLessThenOneMinutes(eta.etaDate)}
              <span
                class="inline-block min-w-[76px] rounded-full bg-vesuvius-300 px-3 py-2 text-center"
              >
                {getDifferentInMinutesByTimeStamp(
                  new Date(eta.eta).getTime()
                )}分鐘
              </span>
            {:else}
              <span
                class="inline-block min-w-[76px] rounded-full bg-vesuvius-300 px-3 py-2 text-center"
              >
                <span class="animate-pulse font-bold text-red-600"
                  >即將到達</span
                >
              </span>
            {/if}
          </li>
        {:else}
          <li>
            <span
              class="bg-vesuvius-300 rounded-full py-2 px-3 inline-block min-w-[76px] text-center text-gray-600"
              >沒有班次</span
            >
          </li>
        {/each}
      </ul>
    </div>
    <div
      class={`${
        showRouteNumber ? 'col-span-6 text-center' : 'col-span-3'
      } h-min`}
      style:--tag={`stop-title-${stopId}`}
    >
      {$stopQuery.data.data.name_tc}
    </div>
    {#if showRouteNumber}
      <div class="col-span-3 text-end">
        <span
          class="inline-block min-w-[76px] rounded-full bg-vesuvius-300 px-3 py-2 text-center"
        >
          {route}
        </span>
      </div>
    {/if}
  </a>
{/if}


