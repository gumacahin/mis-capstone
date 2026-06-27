import type { JSX } from "react";

import {
  EnergyCheckInCard,
  PlannerUnavailableCard,
  PlanSuggestionsCard,
} from "./components";
import type {
  PlannerCheckInInput,
  PlannerSuggestionActionInput,
  TodayPlan,
} from "./types";
import type { PlannerUiComponentName, PlannerUiSchema } from "./uiSchema";

interface PlannerRenderContext {
  isPending: boolean;
  plan?: TodayPlan;
  submitCheckInPending: boolean;
  suggestionActionPending: boolean;
  onSubmitCheckIn: (input: PlannerCheckInInput) => void;
  onSuggestionAction: (input: PlannerSuggestionActionInput) => void;
}

type PlannerRegistryComponent = (
  schema: PlannerUiSchema,
  context: PlannerRenderContext,
) => JSX.Element;

const plannerComponentRegistry: Record<
  PlannerUiComponentName,
  PlannerRegistryComponent
> = {
  EnergyCheckInCard: (schema, context) => (
    <EnergyCheckInCard
      disabled={context.submitCheckInPending}
      plan={context.plan}
      title={schema.title}
      onSubmit={context.onSubmitCheckIn}
    />
  ),
  PlannerUnavailableCard: () => <PlannerUnavailableCard />,
  TodayPlanCard: (schema, context) => (
    <PlanSuggestionsCard
      disabled={context.suggestionActionPending}
      isPending={context.isPending}
      plan={context.plan}
      schema={schema}
      onAction={context.onSuggestionAction}
    />
  ),
  LowEnergyPlanCard: (schema, context) => (
    <PlanSuggestionsCard
      disabled={context.suggestionActionPending}
      isPending={context.isPending}
      plan={context.plan}
      schema={schema}
      onAction={context.onSuggestionAction}
    />
  ),
  TimeBoxPlanCard: (schema, context) => (
    <PlanSuggestionsCard
      disabled={context.suggestionActionPending}
      isPending={context.isPending}
      plan={context.plan}
      schema={schema}
      onAction={context.onSuggestionAction}
    />
  ),
  TaskTriagePanel: (schema, context) => (
    <PlanSuggestionsCard
      disabled={context.suggestionActionPending}
      isPending={context.isPending}
      plan={context.plan}
      schema={schema}
      onAction={context.onSuggestionAction}
    />
  ),
};

export const renderPlannerComponent = (
  schema: PlannerUiSchema,
  context: PlannerRenderContext,
) => {
  const renderComponent =
    plannerComponentRegistry[schema.component] ??
    plannerComponentRegistry.TodayPlanCard;

  return (
    <div key={`${schema.component}-${schema.mode}`}>
      {renderComponent(schema, context)}
    </div>
  );
};
