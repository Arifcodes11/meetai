// import { MeetingsListHeader } from "@/modules/meetings/ui/components/meetings-list-header";
// import { getQueryClient, trpc } from "@/trpc/server";
// import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
// import { Suspense } from "react";
// import { ErrorBoundary } from "react-error-boundary";
// import { auth } from "@/lib/auth";
// import { headers } from "next/headers";
// import type { SearchParams } from "nuqs/server";
// import { redirect } from "next/navigation";
// import { loadSearchParams } from "@/modules/meetings/params";

// import {
//   MeetingsView,
//   MeetingsViewLoading,
//   MeetingsViewError,
// } from "@/modules/meetings/ui/views/meetings-view";


// interface Props {
//   searchParams: Promise<SearchParams>;
// }
// const Page = async ({searchParams}:Props) => {
//   const filters = await loadSearchParams(searchParams);
//   const session = await auth.api.getSession({
//     headers: await headers(),
//   });

//   if (!session) {
//     redirect("/sign-in");
//   }
//   const queryClient = getQueryClient();
//   void queryClient.prefetchQuery(trpc.meetings.getMany.queryOptions({
//     ...filters,
//   }));
//   return (
//     <>
//       <MeetingsListHeader />
//       <HydrationBoundary state={dehydrate(queryClient)}>
//         <Suspense fallback={<MeetingsViewLoading />}>
//           <ErrorBoundary fallback={<MeetingsViewError />}>
//             <MeetingsView />
//           </ErrorBoundary>
//         </Suspense>
//       </HydrationBoundary>
//     </>
//   );
// };
// export default Page;
import { MeetingsListHeader } from "@/modules/meetings/ui/components/meetings-list-header";
import { getQueryClient, trpc } from "@/trpc/server";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import type { SearchParams } from "nuqs/server";
import { redirect } from "next/navigation";
import { loadSearchParams } from "@/modules/meetings/params";

import {
  MeetingsView,
  MeetingsViewLoading,
  MeetingsViewError,
} from "@/modules/meetings/ui/views/meetings-view";

type PageProps = {
  searchParams: Awaited<SearchParams>;
};

const Page = async ({ searchParams }: PageProps) => {
  const filters = await loadSearchParams(searchParams);
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/sign-in");
  }

  const queryClient = getQueryClient();
  void queryClient.prefetchQuery(
    trpc.meetings.getMany.queryOptions({
      ...filters,
    })
  );

  return (
    <>
      <MeetingsListHeader />
      <HydrationBoundary state={dehydrate(queryClient)}>
        <Suspense fallback={<MeetingsViewLoading />}>
          <ErrorBoundary fallback={<MeetingsViewError />}>
            <MeetingsView />
          </ErrorBoundary>
        </Suspense>
      </HydrationBoundary>
    </>
  );
};

export default Page;
