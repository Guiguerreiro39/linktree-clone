"use client";

import { useForm } from "react-hook-form";
import type { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@/components/ui/form";
import { useState } from "react";
import { WelcomeStep } from "@/app/(protected)/onboarding/_components/welcome-step";
import { Card, CardContent } from "@/components/ui/card";
import { BasicInfoStep } from "@/app/(protected)/onboarding/_components/basic-info-step";
import { formSchema } from "./schemas";
import { LinksStep } from "@/app/(protected)/onboarding/_components/links-step";

const STEPS = ["welcome", "basic-info", "links", "completion"] as const;

export default function OnboardingPage() {
  const [currentStep, setCurrentStep] = useState(0);

  const form = useForm<z.infer<typeof formSchema>>({
    mode: "onChange",
    resolver: zodResolver(formSchema),
    defaultValues: {
      tag: "",
      bio: "",
      imageUrl: undefined,
    },
  });

  const onSubmit = () => {
    console.log("nothing");
  };

  return (
    <main className="bg-sidebar min-h-screen p-4">
      <Card className="mx-auto max-w-3xl">
        <CardContent>
          <div className="mb-8">
            <div className="mb-2 flex items-center justify-between gap-2">
              {STEPS.map((step, index) => (
                <button
                  key={step}
                  className="flex-1"
                  onClick={() => setCurrentStep(index)}
                >
                  <div
                    className={`h-2 rounded-full transition-colors ${index <= currentStep ? "bg-accent" : "bg-slate-200"}`}
                  />
                </button>
              ))}
            </div>
            <div className="text-center text-sm text-gray-500">
              Step {currentStep + 1} of {STEPS.length}
            </div>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="px-6">
              {(() => {
                switch (STEPS[currentStep]) {
                  case "welcome":
                    return (
                      <WelcomeStep
                        onNext={() => setCurrentStep((prev) => prev + 1)}
                      />
                    );
                  case "basic-info":
                    return (
                      <BasicInfoStep
                        control={form.control}
                        onBack={() => setCurrentStep((prev) => prev - 1)}
                        onNext={async () => {
                          const isValid =
                            (await form.trigger("tag")) &&
                            (await form.trigger("bio")) &&
                            (await form.trigger("imageUrl"));

                          if (isValid) {
                            setCurrentStep((prev) => prev + 1);
                          }
                        }}
                      />
                    );
                  case "links":
                    return (
                      <LinksStep
                        register={form.register}
                        control={form.control}
                        onBack={() => setCurrentStep((prev) => prev - 1)}
                        onSkip={() => setCurrentStep((prev) => prev + 1)}
                        onNext={async () => {
                          await form.trigger();

                          console.log(form.formState.errors);

                          if (
                            !form.formState.errors.bio &&
                            !form.formState.errors.tag &&
                            !form.formState.errors.imageUrl
                          ) {
                            setCurrentStep((prev) => prev + 1);
                          }
                        }}
                      />
                    );
                  case "completion":
                  default:
                    return null;
                }
              })()}
            </form>
          </Form>
        </CardContent>
      </Card>
    </main>
  );
}
