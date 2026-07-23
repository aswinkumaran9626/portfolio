"use client";

import { FormEvent, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { CheckCircle2, Mail } from "lucide-react";
import { GithubIcon, LinkedinIcon } from "@/components/icons/BrandIcons";
import { SITE } from "@/constants/site";
import { contactFormSchema, ContactFormErrors } from "@/lib/validations";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { GlassCard } from "@/components/shared/GlassCard";
import { TiltCard } from "@/components/shared/TiltCard";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { fadeUp, staggerContainer, floatAnimation } from "@/lib/motion";

const CONTACT_CARDS = [
  { icon: Mail, label: "Email", value: SITE.email, href: `mailto:${SITE.email}` },
  { icon: GithubIcon, label: "GitHub", value: "View profile", href: SITE.social.github },
  { icon: LinkedinIcon, label: "LinkedIn", value: "Connect with me", href: SITE.social.linkedin },
];

export function Contact() {
  const [values, setValues] = useState({ name: "", email: "", message: "" });
  const [errors, setErrors] = useState<ContactFormErrors>({});
  const [status, setStatus] = useState<"idle" | "success">("idle");

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const result = contactFormSchema.safeParse(values);

    if (!result.success) {
      const fieldErrors: ContactFormErrors = {};
      result.error.issues.forEach((issue) => {
        const key = issue.path[0] as keyof ContactFormErrors;
        fieldErrors[key] = issue.message;
      });
      setErrors(fieldErrors);
      setStatus("idle");
      return;
    }

    setErrors({});
    const subject = encodeURIComponent(`Portfolio inquiry from ${result.data.name}`);
    const body = encodeURIComponent(`${result.data.message}\n\n— ${result.data.name} (${result.data.email})`);
    window.location.href = `mailto:${SITE.email}?subject=${subject}&body=${body}`;
    setStatus("success");
  }

  return (
    <section id="contact" className="relative px-4 py-24">
      <div className="mx-auto max-w-5xl">
        <SectionHeading
          eyebrow="Contact"
          title="Let's work together"
          description="Have a project in mind or just want to say hi? Send me a message."
        />

        <div className="mt-16 grid gap-8 lg:grid-cols-[1fr_1.2fr]">
          <motion.div
            variants={staggerContainer(0.1)}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.3 }}
            className="flex flex-col gap-4"
          >
            <motion.div
              variants={fadeUp}
              animate={floatAnimation}
              className="relative mx-auto mb-4 hidden w-48 sm:block"
            >
              <div className="absolute inset-0 -z-10 scale-90 rounded-full bg-gradient-to-br from-primary/25 to-secondary/25 blur-[60px]" />
              <Image
                src="/avatar/confident-pose.png"
                alt="Aswin BalaKumaran, ready to collaborate"
                width={320}
                height={320}
                unoptimized
                className="w-full object-contain drop-shadow-[0_16px_40px_rgba(56,189,248,0.3)]"
              />
            </motion.div>

            {CONTACT_CARDS.map(({ icon: Icon, label, value, href }) => (
              <motion.div key={label} variants={fadeUp}>
                <TiltCard maxTilt={5} className="rounded-2xl">
                  <a href={href} target="_blank" rel="noreferrer" data-cursor-hover className="block">
                    <GlassCard className="flex items-center gap-4">
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/15 text-primary">
                        <Icon className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">{label}</p>
                        <p className="font-medium">{value}</p>
                      </div>
                    </GlassCard>
                  </a>
                </TiltCard>
              </motion.div>
            ))}
          </motion.div>

          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.3 }}
          >
            <GlassCard hover={false}>
              <form onSubmit={handleSubmit} className="flex flex-col gap-5" noValidate>
                <div className="flex flex-col gap-2">
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    value={values.name}
                    onChange={(e) => setValues((v) => ({ ...v, name: e.target.value }))}
                    className="border-white/10 bg-white/5 transition-shadow duration-300 focus-visible:shadow-[0_0_0_3px_rgba(56,189,248,0.25)]"
                    placeholder="Your name"
                  />
                  {errors.name && <p className="text-xs text-destructive">{errors.name}</p>}
                </div>

                <div className="flex flex-col gap-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={values.email}
                    onChange={(e) => setValues((v) => ({ ...v, email: e.target.value }))}
                    className="border-white/10 bg-white/5 transition-shadow duration-300 focus-visible:shadow-[0_0_0_3px_rgba(56,189,248,0.25)]"
                    placeholder="you@example.com"
                  />
                  {errors.email && <p className="text-xs text-destructive">{errors.email}</p>}
                </div>

                <div className="flex flex-col gap-2">
                  <Label htmlFor="message">Message</Label>
                  <Textarea
                    id="message"
                    value={values.message}
                    onChange={(e) => setValues((v) => ({ ...v, message: e.target.value }))}
                    className="min-h-32 border-white/10 bg-white/5 transition-shadow duration-300 focus-visible:shadow-[0_0_0_3px_rgba(56,189,248,0.25)]"
                    placeholder="Tell me about your project..."
                  />
                  {errors.message && <p className="text-xs text-destructive">{errors.message}</p>}
                </div>

                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <Button type="submit" size="lg" className="w-full rounded-full" data-cursor-hover>
                    Send Message
                  </Button>
                </motion.div>

                <AnimatePresence>
                  {status === "success" && (
                    <motion.p
                      initial={{ opacity: 0, y: 8, height: 0 }}
                      animate={{ opacity: 1, y: 0, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="flex items-center gap-2 text-sm text-primary"
                    >
                      <CheckCircle2 className="h-4 w-4" /> Opening your email client to send the message.
                    </motion.p>
                  )}
                </AnimatePresence>
              </form>
            </GlassCard>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
