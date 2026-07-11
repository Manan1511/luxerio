import { EnvelopeSimple, Phone, WhatsappLogo, InstagramLogo, MapPin } from '@phosphor-icons/react';

const CARDS = [
  {
    label: 'Email',
    value: 'help.vancitoco@gmail.com',
    href: 'mailto:help.vancitoco@gmail.com',
    Icon: EnvelopeSimple,
  },
  {
    label: 'Phone',
    value: '+91 78748 41121',
    href: 'tel:+917874841121',
    Icon: Phone,
  },
  {
    label: 'WhatsApp',
    value: '+91 95371 41121',
    href: 'https://wa.me/919537141121',
    Icon: WhatsappLogo,
  },
  {
    label: 'Instagram',
    value: '@_vancito.co',
    href: 'https://www.instagram.com/_vancito.co/',
    Icon: InstagramLogo,
  },
  {
    label: 'Address',
    value: '317, 3rd Floor, Joyos Hubtown, Adajan Patia, Surat, Gujarat 395009',
    href: 'https://www.google.com/maps/search/?api=1&query=' +
      encodeURIComponent('317, 3rd Floor, Joyos Hubtown, Adajan Patia, Surat, Gujarat 395009'),
    Icon: MapPin,
  },
];

export default function Contact() {
  return (
    <div className="mx-auto max-w-[1000px] px-6 py-10 lg:px-16">
      <div className="mb-10 border-b border-hairline pb-6">
        <h1 className="font-display text-4xl font-semibold uppercase tracking-[0.1em] text-primary md:text-5xl">
          Contact Us
        </h1>
        <p className="mt-2 font-display text-[10px] uppercase tracking-widest text-secondary">
          Reach us any of these ways — we usually respond within a day.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {CARDS.map(({ label, value, href, Icon }) => (
          <a
            key={label}
            href={href}
            target={href.startsWith('http') ? '_blank' : undefined}
            rel={href.startsWith('http') ? 'noreferrer' : undefined}
            className="group flex items-start gap-4 border border-hairline bg-surface p-6 transition-colors hover:border-acid"
          >
            <span className="grid h-11 w-11 shrink-0 place-items-center border border-hairline text-primary transition-colors group-hover:border-acid group-hover:text-acid">
              <Icon size={20} weight="regular" />
            </span>
            <span className="flex flex-col gap-1">
              <span className="font-display text-[10px] font-semibold uppercase tracking-widest text-secondary">
                {label}
              </span>
              <span className="font-display text-sm text-primary">
                {value}
              </span>
            </span>
          </a>
        ))}
      </div>
    </div>
  );
}
