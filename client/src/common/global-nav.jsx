import { demos } from "../lib/demos";
import { WCGLogo } from "./wcg-logo";
import { FaBars, FaBarsStaggered } from "react-icons/fa6";
import clsx from "clsx";
import { useLocation } from 'react-router-dom';
import { useState } from "react";
import { Link } from 'react-router-dom'
import { decodedToken } from "../healpers/getDecodedToken";
import Byline from "./byline";

export function GlobalNav() {
  const [isOpen, setIsOpen] = useState(false);
  const close = () => setIsOpen(false);
  const isAdmin = decodedToken()?.user;

  return (
    <>
      <div className="fit-width fixed top-0 z-10 flex flex-col max-lg:justify-around shadow-[aliceblue] bg-cyan-950 lg:bottom-0 lg:z-auto lg:w-72">
        <div className="flex h-14 items-center px-4 py-4 lg:h-auto">

          <Link className="group flex w-full items-center gap-x-2.5" to="/dashboard" onClick={close}>
            <div
              className="h-10 w-10 rounded-full" /* border border-white/30 group-hover:border-white/50 */
            >
              <WCGLogo />
            </div>

            <h3 className="font-semibold tracking-wide text-orange-400 group-hover:text-gray-50">
              <span className="text-xl max-lg:text-sm font-extrabold hover:text-[aliceblue] ">
                WCG Lead Handling
              </span>
            </h3>
          </Link>
        </div>
        <button
          type="button"
          className="group absolute right-0 top-0 h-14 items-center gap-x-2 px-4 lg:hidden"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? (
            <FaBars className="block w-6 text-[aliceblue]" />
          ) : (
            <FaBarsStaggered className="block w-6 text-[aliceblue]" />
          )}
        </button>
        <div
          className={clsx(
            "overflow-y-auto lg:static lg:block lg:bg-transparent bg-[teal]",
            {
              "fixed inset-x-0 bottom-0 top-14 rounded": isOpen,
              hidden: !isOpen,
            }
          )}
        >
          <nav className="space-y-6 px-2 pb-24 pt-5">
            {isAdmin && demos.map((section) => {
              return (
                <div key={section.name}>
                  <div className="mb-2 px-3 text-sm font-extrabold uppercase tracking-wider text-orange-50">
                    <div>{section.name}</div>
                  </div>

                  <div className="space-y-1">
                    {section.items.map((item) => (
                      <GlobalNavItem
                        key={item.slug}
                        item={item}
                        close={close}
                        isAdmin={isAdmin}
                      />
                    ))}
                  </div>
                </div>
              );
            })}
            <Byline className="lg:absolute lg:block lg:bg-transparent absolute" />
          </nav>
        </div>
      </div >
    </>
  );
}

function GlobalNavItem({
  item,
  close,
  isAdmin
}) {
  const location = useLocation()

  const isActive = item.slug === location?.pathname?.split("/")[1];

  return (!item?.user || isAdmin?.role) && (
    <Link
      onClick={close}
      to={`/${item?.slug}`}
      className={clsx("block rounded-md px-3 py-2 text-sm font-medium ", {
        "text-gray-100 hover:bg-[aliceblue]/60 hover:text-white": !isActive,
        "text-white bg-orange-400": isActive,
      })}
    >
      {item.name}
    </Link>
  );
}
