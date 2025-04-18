// This file re-exports all UI components to make them easier to import

// Basic UI components
export { Button } from './button';
export { Input } from './input';
export { Textarea } from './textarea';
export { Checkbox } from './checkbox';
export { Switch } from './switch';
export { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './select';
export { Tabs, TabsContent, TabsList, TabsTrigger } from './tabs';
export { Badge } from './badge';
export { Skeleton } from './skeleton';

// Form components
export { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from './form';

// Layout components
export { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from './card';
export { Table, TableBody, TableCaption, TableCell, TableFooter, TableHead, TableHeader, TableRow } from './table';

// Dialog components
export { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from './dialog';
export { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from './alert-dialog';

// Toast components are exported from their respective files
// export { Toaster } from './toaster';
// export { useToast } from './use-toast';