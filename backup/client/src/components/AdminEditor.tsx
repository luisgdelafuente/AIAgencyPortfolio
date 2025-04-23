import React from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';

interface EditorProps {
  value: string;
  onChange: (value: string) => void;
  preview?: boolean;
}

export function ContentEditor({ value, onChange, preview = false }: EditorProps) {
  // Extract just the content part if the value contains metadata
  const getDisplayContent = (val: string): string => {
    try {
      // Check if this is a JSON string with metadata
      if (typeof val === 'string' && val.trim().startsWith('{')) {
        const parsed = JSON.parse(val);
        if (parsed.content) {
          // If we have a content field in the JSON, use that for display
          return parsed.content;
        }
      }
      // Otherwise just use the raw value
      return val;
    } catch (e) {
      // If it's not valid JSON or there's any error, just use the raw value
      return val;
    }
  };

  if (preview) {
    return (
      <Card className="mt-2">
        <CardContent className="p-4 prose max-w-none">
          <div dangerouslySetInnerHTML={{ __html: getDisplayContent(value) }} />
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-2">
      <Textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="min-h-[200px] font-mono text-sm"
      />
    </div>
  );
}

interface FormFieldProps {
  label: string;
  name: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
  required?: boolean;
}

export function FormField({ 
  label, 
  name, 
  value, 
  onChange, 
  type = "text", 
  required = false 
}: FormFieldProps) {
  return (
    <div className="space-y-2">
      <Label htmlFor={name}>{label}{required && <span className="text-red-500">*</span>}</Label>
      <Input
        id={name}
        name={name}
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required={required}
      />
    </div>
  );
}
