/* eslint-disable tailwindcss/no-custom-classname */

import * as React from "react"

import Footer from "@/components/layout/footer"
import GlobalNav from "@/components/layout/global-nav"
import TopNav from "@/components/layout/top-nav"

interface DefaultLayoutProps {
  children: React.ReactNode
}

export default function DefaultLayout(props: DefaultLayoutProps) {
  const { children } = props

  return (
    <>
      <GlobalNav />
      <div className="w-[calc(100% - 92px)] ml-0 lg:ml-[92px]">
        <TopNav />
        <div className="absolute left-0 top-0 -z-10 min-h-screen w-full">
          <div
            className="pointer-events-none absolute inset-x-0 transform-gpu overflow-hidden blur-3xl sm:-top-80"
            aria-hidden="true"
          >
            <div
              className="oopacity-20 relative left-[calc(50%+3rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 bg-gradient-to-tr from-[#78e08f] to-[#079992] opacity-20 sm:left-[calc(50%+36rem)] sm:w-[72.1875rem]"
              style={{
                clipPath:
                  "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
              }}
            ></div>
          </div>
          <div
            className="pointer-events-none absolute inset-x-0 top-[calc(100%-13rem)] -z-10 transform-gpu overflow-hidden blur-3xl sm:top-[calc(100%-30rem)]"
            aria-hidden="true"
          >
            <div
              className="relative left-[calc(50%+3rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 bg-gradient-to-tr from-[#78e08f] to-[#079992] opacity-20 sm:left-[calc(50%+36rem)] sm:w-[72.1875rem]"
              style={{
                clipPath:
                  "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
              }}
            ></div>
          </div>
        </div>
        <main className="relative mt-4 px-4 lg:my-20 lg:px-24 2xl:px-56">
          {children}
        </main>
        <Footer />
      </div>
    </>
  )
}
