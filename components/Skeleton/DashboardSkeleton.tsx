import React from 'react';

// Reusable skeleton component for better maintainability
const Skeleton = ({ className }: { className?: string }) => {
  return <div className={`animate-pulse rounded bg-gray-200 ${className}`}></div>;
};

const DashboardSkeleton = () => {
  return (
    <div className="min-h-[100svh] w-full bg-gradient-to-b from-[#61CCC2] to-[#FFE08D] md:min-h-screen">
      <div className="container mx-auto px-4 py-8">
        {/* Back button skeleton */}
        <div className="mb-4">
          <Skeleton className="h-10 w-40" />
        </div>

        {/* Registration status card skeleton */}
        <div className="mb-6">
          <div className="rounded-lg border bg-white p-6">
            <div className="flex items-center justify-between">
              <Skeleton className="h-6 w-48" />
              <Skeleton className="h-6 w-32" />
            </div>
            <Skeleton className="mt-2 h-4 w-64" />
          </div>
        </div>

        {/* Tabs skeleton */}
        <div className="w-full">
          <div className="mb-4 grid w-full grid-cols-3">
            {[1, 2, 3].map((item) => (
              <Skeleton key={item} className="mx-1 h-10" />
            ))}
          </div>

          {/* Tab content skeleton */}
          <div className="grid gap-6 md:grid-cols-2">
            {/* Team data card skeleton */}
            <div className="rounded-lg border bg-white p-6">
              <Skeleton className="mb-4 h-6 w-32" />
              <div className="space-y-4">
                <div>
                  <Skeleton className="mb-2 h-5 w-24" />
                  <Skeleton className="h-5 w-48" />
                </div>
                <div>
                  <Skeleton className="mb-2 h-5 w-24" />
                  <Skeleton className="h-5 w-64" />
                </div>
              </div>
            </div>

            {/* Team members card skeleton */}
            <div className="rounded-lg border bg-white p-6">
              <Skeleton className="mb-4 h-6 w-32" />
              <div className="space-y-2">
                {[1, 2, 3].map((item) => (
                  <div key={item} className="flex items-center justify-between border-b pb-2">
                    <Skeleton className="h-5 w-32" />
                    <Skeleton className="h-5 w-20" />
                  </div>
                ))}
              </div>
            </div>

            {/* Registration data card skeleton */}
            <div className="rounded-lg border bg-white p-6 md:col-span-2">
              <Skeleton className="mb-4 h-6 w-32" />
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {[1, 2, 3, 4, 5].map((item) => (
                  <div key={item} className="flex items-center gap-2 rounded-md border p-3">
                    <Skeleton className="h-5 w-5" />
                    <Skeleton className="h-5 w-24" />
                    <Skeleton className="ml-auto h-5 w-12" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardSkeleton;
