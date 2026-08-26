import { Container } from "@/components/ui/container";
import { faqItems } from "./faq-data";
import { FaqInteractive } from "./faq-interactive";

export function FaqSection() {
  return (
    <section aria-labelledby="faq-title" className="faq" id="faq">
      <Container>
        <header className="faq__intro">
          <p className="faq__kicker text-label" dir="ltr" lang="en">
            FAQ
          </p>
          <h2 className="faq__heading text-h2" id="faq-title">
            سؤالاتی که قبل از شروع معمولاً می‌پرسند.
          </h2>
        </header>

        <FaqInteractive>
          <div className="faq__desktop">
            <div className="faq__layout">
              <ol aria-label="سؤالات متداول" className="faq__questions">
                {faqItems.map((item, index) => (
                  <li className="faq__question-row" key={item.number}>
                    <button
                      aria-controls={`faq-answer-${item.number}`}
                      aria-expanded={index === 0}
                      className="faq__question"
                      data-faq-question={index + 1}
                      id={`faq-question-${item.number}`}
                      type="button"
                    >
                      <span aria-hidden="true" className="faq__number" dir="ltr">
                        {item.number}
                      </span>
                      <span className="faq__question-text">{item.question}</span>
                      <span aria-hidden="true" className="faq__mark" />
                    </button>
                  </li>
                ))}
              </ol>

              <div className="faq__answers">
                {faqItems.map((item, index) => (
                  <article
                    aria-hidden={index !== 0}
                    aria-labelledby={`faq-question-${item.number}`}
                    className="faq__answer"
                    data-faq-answer={index + 1}
                    id={`faq-answer-${item.number}`}
                    key={item.number}
                    role="region"
                  >
                    <span aria-hidden="true" className="faq__answer-number" dir="ltr">
                      {item.number}
                    </span>
                    <h3 className="faq__answer-question">{item.question}</h3>
                    <p className="faq__answer-copy">{item.answer}</p>
                  </article>
                ))}
              </div>
            </div>
          </div>

          <ol className="faq__mobile">
            {faqItems.map((item, index) => (
              <li className="faq__mobile-item" key={`mobile-${item.number}`}>
                <h3 className="faq__mobile-heading">
                  <button
                    aria-controls={`faq-mobile-answer-${item.number}`}
                    aria-expanded="false"
                    className="faq__mobile-trigger"
                    data-faq-mobile-trigger={index + 1}
                    id={`faq-mobile-question-${item.number}`}
                    type="button"
                  >
                    <span aria-hidden="true" className="faq__number" dir="ltr">
                      {item.number}
                    </span>
                    <span>{item.question}</span>
                    <span aria-hidden="true" className="faq__mark" />
                  </button>
                </h3>
                <div
                  aria-hidden="true"
                  aria-labelledby={`faq-mobile-question-${item.number}`}
                  className="faq__mobile-answer"
                  data-faq-mobile-answer={index + 1}
                  id={`faq-mobile-answer-${item.number}`}
                  role="region"
                >
                  <div className="faq__mobile-answer-inner">
                    <p>{item.answer}</p>
                  </div>
                </div>
              </li>
            ))}
          </ol>
        </FaqInteractive>
      </Container>
    </section>
  );
}
