'use client';
import React, { useState, useRef, useEffect } from 'react';
import SearchBar from '@/modules/faq/SearchBar';
import FilterTabs from './FilterTabs';
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import "./Faq.css";
import DataFaq from '@/modules/faq/dataFaq';
import Image from 'next/image';

export default function FAQ() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filter, setFilter] = useState("Semua");
  const [isAtTop, setIsAtTop] = useState(true);
  const [isAtBottom, setIsAtBottom] = useState(false);
  const [expanded, setExpanded] = useState(null);
  const accordionRef = useRef(null);

  const filteredQuestions = DataFaq.filter(
    (question) =>
      question.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
      (filter.toLowerCase() === "semua" || question.category === filter.toLowerCase()),
  );

  const handleScroll = () => {
    if (accordionRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = accordionRef.current;
      setIsAtTop(scrollTop === 0);
      setIsAtBottom(scrollTop + clientHeight >= scrollHeight - 1);
    }
  };

  const handleWheel = (e) => {
    if (accordionRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = accordionRef.current;
      const isScrollingUp = e.deltaY < 0;
      const isScrollingDown = e.deltaY > 0;

      if ((isAtTop && isScrollingUp) || (isAtBottom && isScrollingDown)) {
        return;
      }

      e.preventDefault();
      e.stopPropagation();

      const scrollMultiplier = 1.2; 
      accordionRef.current.scrollTop += e.deltaY * scrollMultiplier;
    }
  };

  useEffect(() => {
    const accordionElement = accordionRef.current;

    if (accordionElement) {
      accordionElement.addEventListener("scroll", handleScroll);
      accordionElement.addEventListener("wheel", handleWheel, { passive: false });

      return () => {
        accordionElement.removeEventListener("scroll", handleScroll);
        accordionElement.removeEventListener("wheel", handleWheel);
      };
    }
  }, [isAtTop, isAtBottom]);

  const handleAccordion = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : null);
  };

  return (
    <section className="relative h-[120vh] min-h-screen w-full overflow-hidden bg-[linear-gradient(180deg,_#61ccc2_30%,_#ffe08d_100%)] lg:bg-[linear-gradient(180deg,_#61ccc2_40%,_#ffe08d_100%)]">
      {/* Background */}
      <div className='w-[108%] absolute flex -left-[6vw] bottom-[3vh] sm:-bottom-[1vw] md:bottom-[0vw] lg:-bottom-[3vw] overflow-x-hidden z-0'>
        <Image
          src={'/assets/faq/bg-group.webp'}
          alt='bg tanah'
          width={5000}
          height={5000}
          className=""
        />
      </div>

      <div className="flex h-full w-full lg:w-[80%] px-[8vw] flex-col items-center mx-auto sm:w-full mt-[140px] sm:mt-[18vh] md:mt-[16vh] lg:mt-[20vw] xl:mt-[12vw]">
        <h1 className="z-10 font-kodeMono text-[10vw] text-darkblue font-extrabold sm:text-[4rem]">FAQ</h1>
        <SearchBar setSearchQuery={setSearchQuery} />
        
        <div className='bg-slate-500 bg-opacity-40 mt-[2vw] lg:mt-[1vw] h-[50%] w-full rounded-2xl p-[2vw] z-10'>
        <FilterTabs setFilter={setFilter} />
          <div
            id="faq"
            ref={accordionRef}
            className="z-10 h-[93%] md:h-[90%] overflow-y-auto pr-1"
            style={{ scrollbarGutter: "stable" }}
          >
            {filteredQuestions.map((question) => (
              <Accordion
                key={question.id}
                expanded={expanded === question.id}
                onChange={handleAccordion(question.id)}
                sx={{
                  borderRadius: "0.5rem !important",
                  overflow: "hidden",
                  marginBottom: "0.7rem",
                  "&:before": {
                    display: "none",
                  },
                  "& .MuiAccordionSummary-root.Mui-expanded": {
                    borderBottomLeftRadius: 0,
                    borderBottomRightRadius: 0,
                  },
                  "& .MuiAccordionDetails-root": {
                    borderBottomLeftRadius: "0.5rem",
                    borderBottomRightRadius: "0.5rem",
                  },
                }}
              >
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon sx={{ color: "#1E1E1E" }} />}
                  sx={{
                    backgroundColor: "white",
                  }}
                  className="font-geist text-blue sm:text-[1rem] text-[2.5vw] md:text-[16px] "
                >
                  {question.title}
                </AccordionSummary>
                <AccordionDetails
                  sx={{
                    backgroundColor: "#F5F5F5",
                  }}
                  className="bg-[#DDFFFC] p-4 font-geist sm:p-6 sm:text-[1rem] text-[2.5vw] md:text-[16px] "
                >
                  {question.answer}
                </AccordionDetails>
              </Accordion>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
