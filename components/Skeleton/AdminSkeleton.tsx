import React from 'react';

const AdminSkeleton = () => {
  return (
    <div className="min-h-[100svh] w-full bg-gradient-to-b from-[#61CCC2] to-[#FFE08D] md:min-h-screen">
      <div className="container mx-auto px-4 py-8">
        {/* Back button skeleton */}
        <div className="mb-4">
          <div className="h-10 w-40 animate-pulse rounded-md bg-white/50"></div>
        </div>

        {/* Filter controls skeleton */}
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-3">
            <div className="h-10 w-32 animate-pulse rounded-md bg-white/50"></div>
            <div className="h-10 w-44 animate-pulse rounded-md bg-white/50"></div>
          </div>
          <div className="h-10 w-32 animate-pulse rounded-md bg-white/50"></div>
        </div>

        {/* Tabs skeleton */}
        <div className="mb-4 grid w-full grid-cols-2 gap-1">
          <div className="h-10 animate-pulse rounded-md bg-white/70"></div>
          <div className="h-10 animate-pulse rounded-md bg-white/50"></div>
        </div>

        {/* Teams skeleton */}
        <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-2">
          {Array(4)
            .fill(null)
            .map((_, index) => (
              <div key={index} className="overflow-hidden rounded-lg border bg-white shadow">
                {/* Card header skeleton */}
                <div className="border-b p-4">
                  <div className="flex items-start justify-between">
                    <div className="space-y-2">
                      <div className="h-6 w-40 animate-pulse rounded bg-gray-200"></div>
                      <div className="h-4 w-32 animate-pulse rounded bg-gray-200"></div>
                    </div>
                    <div className="h-6 w-20 animate-pulse rounded-full bg-gray-200"></div>
                  </div>
                </div>

                {/* Card content skeleton */}
                <div className="p-4">
                  <div className="space-y-4">
                    {/* Contact info skeleton */}
                    <div className="space-y-2">
                      <div className="h-4 w-16 animate-pulse rounded bg-gray-200"></div>
                      <div className="h-5 w-40 animate-pulse rounded bg-gray-200"></div>
                    </div>

                    {/* Email skeleton */}
                    <div className="space-y-2">
                      <div className="h-4 w-16 animate-pulse rounded bg-gray-200"></div>
                      <div className="h-5 w-48 animate-pulse rounded bg-gray-200"></div>
                    </div>

                    {/* Team members skeleton */}
                    <div className="space-y-2">
                      <div className="h-4 w-24 animate-pulse rounded bg-gray-200"></div>
                      <ul className="ml-5 space-y-2">
                        <li className="h-5 w-32 animate-pulse rounded bg-gray-200"></li>
                        <li className="h-5 w-32 animate-pulse rounded bg-gray-200"></li>
                      </ul>
                    </div>

                    {/* Files skeleton */}
                    <div className="space-y-2">
                      <div className="h-4 w-16 animate-pulse rounded bg-gray-200"></div>
                      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                        <div className="h-10 animate-pulse rounded-md bg-gray-200"></div>
                        <div className="h-10 animate-pulse rounded-md bg-gray-200"></div>
                      </div>
                    </div>

                    {/* Buttons skeleton */}
                    <div className="flex justify-end">
                      <div className="h-9 w-24 animate-pulse rounded-md bg-gray-200"></div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
        </div>

        {/* Submissions tab skeleton (hidden by default) */}
        <div className="hidden">
          <div className="overflow-hidden rounded-lg border bg-white shadow">
            <div className="border-b p-4">
              <div className="space-y-2">
                <div className="h-6 w-40 animate-pulse rounded bg-gray-200"></div>
                <div className="h-4 w-64 animate-pulse rounded bg-gray-200"></div>
              </div>
            </div>
            <div className="p-4">
              <div className="space-y-6">
                {Array(3)
                  .fill(null)
                  .map((_, index) => (
                    <div key={index} className="rounded-lg border">
                      <div className="border-b bg-muted/40 p-4">
                        <div className="flex items-center justify-between">
                          <div className="space-y-2">
                            <div className="h-5 w-40 animate-pulse rounded bg-gray-200"></div>
                            <div className="h-4 w-32 animate-pulse rounded bg-gray-200"></div>
                          </div>
                          <div className="h-6 w-20 animate-pulse rounded-full bg-gray-200"></div>
                        </div>
                      </div>

                      <div className="divide-y">
                        {Array(2)
                          .fill(null)
                          .map((_, subIndex) => (
                            <div
                              key={subIndex}
                              className="flex items-center justify-between gap-4 p-4"
                            >
                              <div className="flex-1 space-y-2">
                                <div className="h-5 w-36 animate-pulse rounded bg-gray-200"></div>
                                <div className="h-4 w-40 animate-pulse rounded bg-gray-200"></div>
                              </div>
                              <div className="flex items-center gap-2">
                                <div className="h-8 w-20 animate-pulse rounded-md bg-gray-200"></div>
                              </div>
                            </div>
                          ))}
                      </div>
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

export default AdminSkeleton;
