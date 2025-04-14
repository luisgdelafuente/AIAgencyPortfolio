import React, { useState, useEffect } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Helmet } from "react-helmet";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { useLoadingState } from '@/hooks/use-loading-state';
import { MapPin, Mail, Phone } from 'lucide-react';
import { 
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription 
} from '@/components/ui/card';

interface ContactContent {
  title: string;
  subtitle: string;
  email: string;
  phone: string;
  address: string;
  formTitle: string;
}

export default function Contact() {
  const { toast } = useToast();
  const { startLoading, stopLoading } = useLoadingState();
  const [content, setContent] = useState<ContactContent>({
    title: "Contact Us",
    subtitle: "Have questions about our AI solutions? We'd love to hear from you.",
    email: "info@hal149.com",
    phone: "+1 (555) 123-4567",
    address: "1234 AI Boulevard\nSan Francisco, CA 94107",
    formTitle: "Send us a message"
  });
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchContent = async () => {
      try {
        // Start global loading state if fetch takes more than 1s
        const loadingTimeout = setTimeout(() => {
          startLoading();
        }, 1000);
        
        const response = await fetch('/api/page-contents/contact');
        if (response.ok) {
          const data = await response.json();
          const parsedContent = JSON.parse(data.content);
          setContent(parsedContent);
        }
        
        // Clear timeout and stop loading
        clearTimeout(loadingTimeout);
        stopLoading();
      } catch (error) {
        console.error('Error fetching contact page content:', error);
        stopLoading();
      } finally {
        setLoading(false);
      }
    };

    fetchContent();
  }, [startLoading, stopLoading]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Start global loading state
    startLoading();
    
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      
      if (response.ok) {
        toast({
          title: 'Message sent',
          description: 'We\'ve received your message and will get back to you soon!',
        });
        
        // Reset form after successful submission
        setFormData({
          name: '',
          email: '',
          subject: '',
          message: ''
        });
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to send message');
      }
    } catch (error) {
      console.error('Error sending contact message:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: error instanceof Error 
          ? error.message 
          : 'There was a problem sending your message. Please try again.',
      });
    } finally {
      setIsSubmitting(false);
      // Stop global loading state
      stopLoading();
    }
  };

  return (
    <>
      <Helmet>
        <title>Contact | HAL149</title>
        <meta name="description" content="Get in touch with the HAL149 team for inquiries about our AI solutions and services." />
      </Helmet>
      
      <div className="min-h-screen flex flex-col">
        <Header />
        
        <main className="flex-grow pt-28">
          <div className="max-w-[85rem] mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mb-12">
              <h1 className="text-4xl font-bold text-gray-900 mb-6">
                {content.title}
              </h1>
              <p className="text-lg text-gray-600">
                {content.subtitle}
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
              <div className="md:col-span-1">
                <div className="space-y-8">
                  <Card className="border border-gray-200 shadow-sm">
                    <CardContent className="p-6">
                      <div className="flex items-start space-x-4">
                        <div className="bg-gray-100 p-2 rounded-full">
                          <MapPin className="h-5 w-5 text-gray-700" />
                        </div>
                        <div>
                          <h3 className="font-medium text-gray-900 mb-1">Address</h3>
                          <p className="text-gray-600 text-sm">
                            {content.address.split('\n').map((line, i) => (
                              <React.Fragment key={i}>
                                {line}
                                <br />
                              </React.Fragment>
                            ))}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card className="border border-gray-200 shadow-sm">
                    <CardContent className="p-6">
                      <div className="flex items-start space-x-4">
                        <div className="bg-gray-100 p-2 rounded-full">
                          <Mail className="h-5 w-5 text-gray-700" />
                        </div>
                        <div>
                          <h3 className="font-medium text-gray-900 mb-1">Email</h3>
                          <p className="text-gray-600 text-sm">
                            {content.email}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card className="border border-gray-200 shadow-sm">
                    <CardContent className="p-6">
                      <div className="flex items-start space-x-4">
                        <div className="bg-gray-100 p-2 rounded-full">
                          <Phone className="h-5 w-5 text-gray-700" />
                        </div>
                        <div>
                          <h3 className="font-medium text-gray-900 mb-1">Phone</h3>
                          <p className="text-gray-600 text-sm">
                            {content.phone}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
              
              <div className="md:col-span-2">
                <Card className="border border-gray-200 shadow-sm">
                  <CardHeader>
                    <CardTitle className="text-xl font-bold text-gray-900">{content.formTitle}</CardTitle>
                    <CardDescription className="text-gray-600">
                      Fill out the form below and we'll get back to you as soon as possible.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-6">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <Label htmlFor="name" className="text-gray-700">Name</Label>
                          <Input 
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            className="border-gray-300 focus:border-gray-400 focus:ring-gray-400"
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="email" className="text-gray-700">Email</Label>
                          <Input 
                            id="email"
                            name="email"
                            type="email"
                            value={formData.email}
                            onChange={handleChange}
                            className="border-gray-300 focus:border-gray-400 focus:ring-gray-400"
                            required
                          />
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="subject" className="text-gray-700">Subject</Label>
                        <Input 
                          id="subject"
                          name="subject"
                          value={formData.subject}
                          onChange={handleChange}
                          className="border-gray-300 focus:border-gray-400 focus:ring-gray-400"
                          required
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="message" className="text-gray-700">Message</Label>
                        <Textarea 
                          id="message"
                          name="message"
                          value={formData.message}
                          onChange={handleChange}
                          className="border-gray-300 focus:border-gray-400 focus:ring-gray-400"
                          rows={6}
                          required
                        />
                      </div>
                      
                      <Button 
                        type="submit" 
                        className="w-full bg-black hover:bg-gray-900 text-white py-2"
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? 'Sending...' : 'Send Message'}
                      </Button>
                    </form>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </main>
        
        <Footer />
      </div>
    </>
  );
}