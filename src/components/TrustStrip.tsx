import { Shield, Wrench, Box, Award, Users } from 'lucide-react';

const features = [
  {
    icon: Shield,
    title: 'خبره أكثر من 20 عاماً',
    proof: 'في السلطنة',
  },
  {
    icon: Users,
    title: 'أكتر من 15,0000 مشروع',
    proof: 'فريق معتمد ومحترف',
  },
  {
    icon: Box,
    title: 'خامات أوربية بمعايير دولية',
    proof: 'خامات المانية',
  },
  {
    icon: Award,
    title: 'ضمان 10 سنوات',
    proof: 'علي جميع المنتجات',
  },
  {
    icon: Wrench,
    title: 'تركي مجاني',
    proof: 'خدمة ما بعد البيع',
  },
];

export function TrustStrip() {
  return (
    <section className="section-padding bg-gradient-to-br from-[var(--color-primary)]/5 to-[var(--color-accent)]/5">
      <div className="container">
        <div className="text-center mb-12">
          <h2>لماذا تختار Sindbad؟</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            التزامنا بالجودة والاحترافية يجعلنا الخيار الأمثل
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div
                key={index}
                className="bg-white rounded-[var(--radius-card)] shadow-[var(--shadow-soft)] p-6 text-center hover:shadow-[var(--shadow-md)] hover:-translate-y-1 transition-all duration-300"
              >
                <div className="w-16 h-16 bg-[var(--color-primary)]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Icon className="w-8 h-8 text-[var(--color-primary)]" />
                </div>
                <h4 className="mb-2">{feature.title}</h4>
                <p className="text-sm text-gray-600 m-0">{feature.proof}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
