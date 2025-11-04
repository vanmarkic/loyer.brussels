'use client';

import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Mail, Users, Newspaper } from 'lucide-react';

export default function ContactPage() {
  const t = useTranslations('contact');
  const tWuune = useTranslations('wuune');

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    message: '',
    wantsMembership: false,
    wantsNewsletter: false,
    wantsAssemblyInvites: false,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate submission (will be replaced with actual server action)
    await new Promise((resolve) => setTimeout(resolve, 1000));

    setSubmitted(true);
    setIsSubmitting(false);
  };

  if (submitted) {
    return (
      <main className="min-h-screen bg-gray-50 py-8 px-4 md:px-8">
        <div className="max-w-4xl mx-auto">
          <Card className="bg-green-50 border-green-200">
            <CardContent className="p-8 text-center">
              <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-8 h-8 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
              <h2 className="text-2xl font-bold mb-4">{t('success')}</h2>
              <p className="text-gray-700 mb-6">
                We'll contact you within 48 hours. You'll receive a confirmation email shortly.
              </p>
              <div className="flex gap-4 justify-center">
                <Link href="/calculator">
                  <Button>Return to Calculator</Button>
                </Link>
                <Link href="/">
                  <Button variant="outline">Go Home</Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 py-8 px-4 md:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <Link
            href="/calculator"
            className="text-blue-600 hover:text-blue-700 transition-colors inline-flex items-center gap-2"
          >
            ← Back to calculator
          </Link>
        </div>

        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">{t('title')}</h1>
          <p className="text-xl text-gray-600">{t('subtitle')}</p>
        </div>

        {/* Information Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <Card>
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Mail className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="font-semibold mb-2">Contact</h3>
              <p className="text-sm text-gray-600 mb-2">{tWuune('contact')}</p>
              <p className="text-xs text-gray-500">Response within 48 hours</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="font-semibold mb-2">Assemblies</h3>
              <p className="text-sm text-gray-600 mb-2">Monthly meetings</p>
              <p className="text-xs text-gray-500">Online & in-person options</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Newspaper className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="font-semibold mb-2">Newsletter</h3>
              <p className="text-sm text-gray-600 mb-2">Monthly updates</p>
              <p className="text-xs text-gray-500">Housing rights news</p>
            </CardContent>
          </Card>
        </div>

        {/* Contact Form */}
        <Card>
          <CardHeader>
            <CardTitle>Contact WUUNE</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="firstName">First Name *</Label>
                  <Input
                    id="firstName"
                    required
                    value={formData.firstName}
                    onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="lastName">Last Name *</Label>
                  <Input
                    id="lastName"
                    required
                    value={formData.lastName}
                    onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="email">{t('email')} *</Label>
                <Input
                  id="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>

              <div>
                <Label htmlFor="phone">{t('phone')}</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                />
              </div>

              <div>
                <Label htmlFor="message">{t('message')}</Label>
                <textarea
                  id="message"
                  rows={5}
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                />
              </div>

              <div className="space-y-3 border-t pt-4">
                <h3 className="font-semibold">I want to:</h3>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={formData.wantsMembership}
                    onChange={(e) =>
                      setFormData({ ...formData, wantsMembership: e.target.checked })
                    }
                  />
                  <span>Join WUUNE as a member</span>
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={formData.wantsNewsletter}
                    onChange={(e) =>
                      setFormData({ ...formData, wantsNewsletter: e.target.checked })
                    }
                  />
                  <span>Receive the newsletter</span>
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={formData.wantsAssemblyInvites}
                    onChange={(e) =>
                      setFormData({ ...formData, wantsAssemblyInvites: e.target.checked })
                    }
                  />
                  <span>Get assembly invitations</span>
                </label>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded p-4 text-sm">
                <p className="font-semibold mb-2">What WUUNE Offers:</p>
                <ul className="space-y-1 text-gray-700">
                  <li>• Free rent negotiation support</li>
                  <li>• Legal advice and mediation</li>
                  <li>• Community of 500+ Brussels tenants</li>
                  <li>• Monthly assemblies (online & in-person)</li>
                  <li>• Housing rights workshops</li>
                  <li>• Collective bargaining power</li>
                </ul>
              </div>

              <Button type="submit" size="lg" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? 'Sending...' : t('send')}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
