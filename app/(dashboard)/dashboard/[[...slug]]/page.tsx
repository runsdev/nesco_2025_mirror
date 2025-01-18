import { AppSidebar } from '@/components/app-sidebar';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui-template/breadcrumb';
import { Separator } from '@/components/ui-template/separator';
import { SidebarInset, SidebarProvider, SidebarTrigger } from '@/components/ui-template/sidebar';
import { LocaleSwitcher } from '@/components/locale-switcher';
import { ThemeSwitcher } from '@/components/theme-switcher';
import * as React from 'react';

export default async function Page({ params }: { params: Promise<{ slug?: string[] }> }) {
  const slug = (await params).slug;
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <Breadcrumb>
              <BreadcrumbList>
                {slug?.map((segment, index) => {
                  // Build the href by joining all segments up to the current one
                  const href = `/dashboard/${slug.slice(0, index + 1).join('/')}`;

                  return (
                    <React.Fragment key={index}>
                      <BreadcrumbSeparator className="hidden md:block" />
                      <BreadcrumbItem className="hidden md:block">
                        {index === slug.length - 1 ? (
                          // Last item should be non-clickable
                          <BreadcrumbPage>
                            {segment
                              .split('-')
                              .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                              .join(' ')}
                          </BreadcrumbPage>
                        ) : (
                          // Other items are links
                          <BreadcrumbLink href={href}>
                            {segment
                              .split('-')
                              .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                              .join(' ')}
                          </BreadcrumbLink>
                        )}
                      </BreadcrumbItem>
                    </React.Fragment>
                  );
                })}
              </BreadcrumbList>
            </Breadcrumb>
          </div>
          <div className="flex-1" />
          <div className="flex items-center gap-2 px-4">
            <LocaleSwitcher />
            <ThemeSwitcher />
          </div>
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
          <div className="grid auto-rows-min gap-4 md:grid-cols-3">
            <div className="aspect-video rounded-xl bg-muted/50" />
            <div className="aspect-video rounded-xl bg-muted/50" />
            <div className="aspect-video rounded-xl bg-muted/50" />
          </div>
          <div className="min-h-[100vh] flex-1 rounded-xl bg-muted/50 md:min-h-min" />
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
