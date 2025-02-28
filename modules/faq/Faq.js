'use client';
import React, { useState, useRef, useEffect } from 'react';
import FilterTabs from './FilterTabs';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import './Faq.css';
import DataFaq from '@/modules/faq/dataFaq';
import Image from 'next/image';
import dynamic from 'next/dynamic';
const SearchBar = dynamic(() => import('@/modules/faq/SearchBar'), { ssr: false });

export default function FAQ() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState('General');
  const [isAtTop, setIsAtTop] = useState(true);
  const [isAtBottom, setIsAtBottom] = useState(false);
  const [expanded, setExpanded] = useState(null);
  const accordionRef = useRef(null);

  const filteredQuestions = DataFaq.filter(
    (question) =>
      question.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
      (filter.toLowerCase() === 'general' || question.category === filter),
  );

  useEffect(() => {
    const handleScroll = () => {
      if (accordionRef.current) {
        const { scrollTop, scrollHeight, clientHeight } = accordionRef.current;
        setIsAtTop(scrollTop === 0);
        setIsAtBottom(scrollTop + clientHeight >= scrollHeight - 1);
      }
      return null;
    };

    const handleWheel = (e) => {
      if (accordionRef.current) {
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
      return null;
    };

    const accordionElement = accordionRef.current;

    if (accordionElement) {
      accordionElement.addEventListener('scroll', handleScroll);
      accordionElement.addEventListener('wheel', handleWheel, { passive: false });

      return () => {
        accordionElement.removeEventListener('scroll', handleScroll);
        accordionElement.removeEventListener('wheel', handleWheel);
      };
    }
  }, [isAtTop, isAtBottom]);

  const handleAccordion = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : null);
  };

  return (
    <section className="relative h-[120vh] min-h-screen w-full overflow-hidden bg-[linear-gradient(180deg,_#61ccc2_30%,_#ffe08d_100%)] lg:bg-[linear-gradient(180deg,_#61ccc2_40%,_#ffe08d_100%)]">
      {/* Background */}
      <div className="absolute -left-[6vw] bottom-[3vh] z-0 flex w-[108%] overflow-x-hidden sm:-bottom-[1vw] md:bottom-[0vw] lg:-bottom-[3vw]">
        <Image
          src={'/assets/faq/bg-group.webp'}
          alt="bg tanah"
          width={5000}
          height={5000}
          className=""
        />
      </div>

      <div className="mx-auto mt-[140px] flex h-full w-full flex-col items-center px-[8vw] sm:mt-[18vh] sm:w-full md:mt-[16vh] lg:mt-[20vw] lg:w-[80%] xl:mt-[12vw]">
        <h1 className="z-10 font-kodeMono text-[10vw] font-extrabold text-darkblue sm:text-[4rem]">
          FAQ
        </h1>
        <SearchBar setSearchQuery={setSearchQuery} />

        <div className="z-10 mt-[2vw] h-[50%] w-full rounded-2xl bg-slate-500 bg-opacity-40 p-[2vw] lg:mt-[1vw]">
          <FilterTabs filter={filter} setFilter={setFilter} />
          <div
            id="faq"
            ref={accordionRef}
            className="z-10 h-[93%] overflow-y-auto pr-1 md:h-[90%]"
            style={{ scrollbarGutter: 'stable' }}
          >
            {filteredQuestions.map((question) => (
              <Accordion
                key={question.id}
                expanded={expanded === question.id}
                onChange={handleAccordion(question.id)}
                sx={{
                  borderRadius: '0.5rem !important',
                  overflow: 'hidden',
                  marginBottom: '0.7rem',
                  '&:before': {
                    display: 'none',
                  },
                  '& .MuiAccordionSummary-root.Mui-expanded': {
                    borderBottomLeftRadius: 0,
                    borderBottomRightRadius: 0,
                    fontWeight: 600,
                    transition: 'all 1s ease',
                  },
                  '& .MuiAccordionDetails-root': {
                    borderBottomLeftRadius: '0.5rem',
                    borderBottomRightRadius: '0.5rem',
                  },
                }}
              >
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon sx={{ color: '#1E1E1E' }} />}
                  sx={{
                    backgroundColor: 'white',
                    '&.Mui-expanded': {
                      marginBottom: 0,
                      marginTop: 0,
                      paddingTop: 0,
                      paddingBottom: 0,
                    },
                  }}
                  className="font-montserrat text-[2.5vw] text-blue sm:text-[1rem] md:text-[16px]"
                >
                  {question.title}
                </AccordionSummary>
                <AccordionDetails
                  sx={{
                    backgroundColor: '#F5F5F5',
                  }}
                  className="bg-[#DDFFFC] p-4 font-montserrat text-[2.5vw] sm:p-6 sm:text-[1rem] md:text-[16px]"
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
