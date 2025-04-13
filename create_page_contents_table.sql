-- SQL to create page_contents table in Supabase
-- Copy this entire file and run it in the Supabase SQL Editor

-- Create the page_contents table with the exact schema that matches our app
CREATE TABLE IF NOT EXISTS page_contents (
  id SERIAL PRIMARY KEY,
  page TEXT NOT NULL UNIQUE,
  content JSONB NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- Insert initial content for static pages
INSERT INTO page_contents (page, content, updated_at)
VALUES
  ('home', 
   '{"heroTitle":"Leading the AI Revolution","heroSubtitle":"We help enterprises transform through cutting-edge artificial intelligence solutions","heroCta":"Join Our Waitlist","featuresTitle":"Our Capabilities","featuresSubtitle":"Transforming businesses through intelligent technology"}',
   CURRENT_TIMESTAMP),
  ('about', 
   '{"title":"About Us","mission":"Our mission is to democratize artificial intelligence and make its benefits accessible to businesses of all sizes.","vision":"We envision a future where AI enhances human potential rather than replacing it, creating more opportunities for innovation and growth.","history":"Founded in 2020, our team of AI specialists and industry experts has been at the forefront of developing practical applications of machine learning that solve real business problems.","team":[{"name":"Alex Johnson","role":"CEO & Co-founder","bio":"Former ML research lead at Stanford AI Lab with 15+ years of experience in the field."},{"name":"Maria Chen","role":"CTO & Co-founder","bio":"PhD in Computer Science, specializing in deep learning architectures and their applications."},{"name":"David Park","role":"Head of Product","bio":"Experienced product leader who previously scaled AI products at major tech companies."}]}',
   CURRENT_TIMESTAMP),
  ('contact', 
   '{"title":"Get in Touch","subtitle":"We''d love to hear from you and discuss how we can help transform your business","email":"info@aiagency.com","phone":"+1 (555) 123-4567","address":"123 Tech Hub, San Francisco, CA 94105","formTitle":"Send us a message"}',
   CURRENT_TIMESTAMP),
  ('legal', 
   '{"title":"Legal Information","sections":[{"title":"Privacy Policy","content":"We respect your privacy and are committed to protecting your personal data. This privacy policy will inform you about how we look after your personal data when you visit our website and tell you about your privacy rights and how the law protects you."},{"title":"Terms of Service","content":"By accessing our website and services, you agree to these terms of service. Please read them carefully. If you do not agree with these terms, you should not use our website or services."},{"title":"Cookie Policy","content":"Our website uses cookies to distinguish you from other users of our website. This helps us to provide you with a good experience when you browse our website and also allows us to improve our site."}]}',
   CURRENT_TIMESTAMP)
ON CONFLICT (page) DO NOTHING;

-- Enable RLS but allow public access
ALTER TABLE page_contents ENABLE ROW LEVEL SECURITY;

-- Create policy that allows all operations for now
CREATE POLICY "Public Access" ON page_contents
  USING (true)
  WITH CHECK (true);

-- Verify that the table exists and has data
SELECT * FROM page_contents;