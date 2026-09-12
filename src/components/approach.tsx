import { Container } from "@/components/ui/container";
import { homeContent } from "@/content";
import { ApproachDiagram } from "./approach-diagram";
import { ApproachStage } from "./approach-stage";

const steps = homeContent.approach.steps.map((step, index) => ({
  ...step,
  index: index + 1,
  number: String(index + 1).padStart(2, "0"),
}));

export function Approach() {
  return (
    <section aria-label={homeContent.approach.ariaLabel} className="approach" id="approach">
      <Container>
        <ApproachStage>
          <div aria-hidden="true" className="approach__rail">
            <span className="approach__rail-track">
              <span className="approach__rail-fill" />
            </span>
            <ul className="approach__rail-marks">
              {steps.map((step) => (
                <li className="approach__rail-mark" data-mark={step.index} key={step.number}>
                  {step.number}
                </li>
              ))}
            </ul>
          </div>

          <ol className="approach__steps">
            {steps.map((step) => (
              <li className="approach__step" data-step={step.index} key={step.number}>
                <span aria-hidden="true" className="approach__figure">
                  {step.number}
                </span>

                <p className="approach__eyebrow text-label">
                  <span dir="ltr">{step.number}</span>
                  <span aria-hidden="true">—</span>
                  <span dir="ltr" lang="en">
                    {step.latin}
                  </span>
                  <span aria-hidden="true">/</span>
                  <span>{step.persian}</span>
                </p>

                <h2 className="approach__statement">{step.statement}</h2>
                <p className="approach__body">{step.body}</p>
              </li>
            ))}
          </ol>

          <div aria-hidden="true" className="approach__visual">
            <ApproachDiagram />
          </div>
        </ApproachStage>
      </Container>
    </section>
  );
}
